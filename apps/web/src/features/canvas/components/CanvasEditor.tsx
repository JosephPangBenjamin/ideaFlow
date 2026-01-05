import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useAtom } from 'jotai';
import { Message } from '@arco-design/web-react';
import { CanvasNode } from './CanvasNode';
import { SaveIndicator } from './SaveIndicator';
import { ZoomIndicator } from './ZoomIndicator';
import {
  currentCanvasAtom,
  canvasNodesAtom,
  selectedNodeIdAtom,
  scaleAtom,
  positionAtom,
} from '../stores/canvasAtoms';
import { calculateZoom, toCanvasCoords } from '../utils/canvasUtils';
import { useQueryClient } from '@tanstack/react-query';
import {
  updateNode,
  addNode,
  Canvas,
  CanvasNode as CanvasNodeType,
} from '../services/canvas.service';
import { useAutoSave } from '../hooks/useAutoSave';

interface CanvasEditorProps {
  canvas: Canvas;
  initialNodes?: CanvasNodeType[];
}

export function CanvasEditor({ canvas, initialNodes = [] }: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [, setCurrentCanvas] = useAtom(currentCanvasAtom);
  const [nodes, setNodes] = useAtom(canvasNodesAtom);
  const [selectedNodeId, setSelectedNodeId] = useAtom(selectedNodeIdAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const queryClient = useQueryClient();

  // Pending node updates for auto-save
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, { x: number; y: number }>>(
    {}
  );

  // Initialize canvas and nodes, reset zoom/pan
  useEffect(() => {
    setCurrentCanvas(canvas);
    setNodes(initialNodes);
    // Reset zoom and position when canvas changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [canvas, initialNodes, setCurrentCanvas, setNodes, setScale, setPosition]);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle wheel zoom - zoom centered on mouse position
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const direction = e.evt.deltaY > 0 ? -1 : 1;

      const { scale: newScale, position: newPos } = calculateZoom(
        scale,
        position,
        pointer,
        direction
      );

      setScale(newScale);
      setPosition(newPos);
    },
    [scale, position, setScale, setPosition]
  );

  // Handle stage drag end (for panning)
  const handleStageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      // Only update position if dragging the stage itself
      if (e.target === e.target.getStage()) {
        setPosition({
          x: e.target.x(),
          y: e.target.y(),
        });
      }
    },
    [setPosition]
  );

  // Reset zoom and position
  const handleResetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [setScale, setPosition]);

  // Handle double click to reset view
  const handleStageDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Only reset if double-clicking on empty stage area
      if (e.target === e.target.getStage()) {
        handleResetView();
      }
    },
    [handleResetView]
  );

  // Handle node drag end - update local state immediately
  const handleDragEnd = useCallback(
    (nodeId: string, x: number, y: number) => {
      // Update local state immediately (optimistic update)
      setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node)));

      // Queue for auto-save
      setPendingUpdates((prev) => ({
        ...prev,
        [nodeId]: { x, y },
      }));
    },
    [setNodes]
  );

  // Auto-save pending updates
  const savePendingUpdates = useCallback(async () => {
    const updates = { ...pendingUpdates };
    if (Object.keys(updates).length === 0) return;

    // Clear pending updates immediately to avoid duplicates
    setPendingUpdates({});

    try {
      // Update all pending nodes
      await Promise.all(Object.entries(updates).map(([nodeId, pos]) => updateNode(nodeId, pos)));

      // Invalidate current canvas query to ensure fresh data on next navigation
      queryClient.invalidateQueries({ queryKey: ['canvas', canvas.id] });
    } catch (error) {
      console.error('Failed to save node positions:', error);
      Message.error('保存失败');
      // Restore updates if failed
      setPendingUpdates((prev) => ({ ...updates, ...prev }));
    }
  }, [pendingUpdates, setPendingUpdates, queryClient, canvas.id]);

  // Enable auto-save
  useAutoSave({
    data: pendingUpdates,
    onSave: savePendingUpdates,
    delay: 1000,
    enabled: Object.keys(pendingUpdates).length > 0,
  });

  // Handle node selection
  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
    },
    [setSelectedNodeId]
  );

  // Handle stage click (deselect)
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Only deselect if clicking on empty stage area
      if (e.target === e.target.getStage()) {
        setSelectedNodeId(null);
      }
    },
    [setSelectedNodeId]
  );

  // Handle drop from ideas sidebar
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      const ideaId = e.dataTransfer.getData('ideaId');
      if (!ideaId) return;

      // Calculate drop position relative to stage content (accounting for zoom/pan)
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      // Convert screen position to canvas position
      const { x, y } = toCanvasCoords({ x: pointerX, y: pointerY }, position, scale);

      try {
        const response = await addNode(canvas.id, {
          ideaId,
          x,
          y,
        });

        // Add the new node to state
        setNodes((prev) => [...prev, response.data]);

        // Invalidate canvases list to update node count
        queryClient.invalidateQueries({ queryKey: ['canvases'] });

        Message.success('节点已添加');
      } catch (error) {
        Message.error('添加节点失败');
      }
    },
    [canvas.id, setNodes, queryClient, scale, position]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="canvas-editor-container"
      className="w-full h-full bg-slate-900 relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleStageDragEnd}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDblClick={handleStageDblClick}
        onDblTap={handleStageDblClick}
      >
        <Layer>
          {nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelect={handleNodeSelect}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
      <SaveIndicator />
      <ZoomIndicator onReset={handleResetView} />
    </div>
  );
}
