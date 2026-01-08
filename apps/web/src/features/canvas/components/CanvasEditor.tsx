import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { api } from '@/services/api';
import { Stage, Layer, Line, Rect } from 'react-konva';
import Konva from 'konva';
import { useAtom } from 'jotai';
import { Message, Modal, Input, Space } from '@arco-design/web-react';
import { CanvasNode } from './CanvasNode';
import { ConnectionLine } from './ConnectionLine';
import { ZoomIndicator } from './ZoomIndicator';
import { CanvasToolbar } from './CanvasToolbar'; // Canvas V2: Manual Toolbar
import {
  currentCanvasAtom,
  canvasNodesAtom,
  connectionsAtom,
  selectedNodeIdAtom,
  selectedConnectionIdAtom,
  scaleAtom,
  positionAtom,
  isConnectingAtom,
  connectingFromNodeIdAtom,
  interactionModeAtom, // New atom
} from '../stores/canvasAtoms';
import { calculateZoom, toCanvasCoords } from '../utils/canvasUtils';
import { REGION_COLORS, DEFAULT_REGION_COLOR } from '../utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import {
  updateNode,
  addNode,
  addConnection,
  updateConnection,
  deleteConnection,
  Canvas,
  CanvasNode as CanvasNodeType,
  CanvasConnection,
  CanvasNodeType as NodeTypeEnum, // Canvas V2
} from '../services/canvas.service';

interface CanvasEditorProps {
  canvas: Canvas;
  initialNodes?: CanvasNodeType[];
  initialConnections?: CanvasConnection[];
}

export function CanvasEditor({
  canvas,
  initialNodes = [],
  initialConnections = [],
}: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [, setCurrentCanvas] = useAtom(currentCanvasAtom);
  const [nodes, setNodes] = useAtom(canvasNodesAtom);
  const [connections, setConnections] = useAtom(connectionsAtom);
  const [selectedNodeId, setSelectedNodeId] = useAtom(selectedNodeIdAtom);
  const [selectedConnectionId, setSelectedConnectionId] = useAtom(selectedConnectionIdAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [connectingFromNodeId, setConnectingFromNodeId] = useAtom(connectingFromNodeIdAtom);
  const [interactionMode, setInteractionMode] = useAtom(interactionModeAtom);
  const queryClient = useQueryClient();

  // Region creation state
  const [creatingRegionStart, setCreatingRegionStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [ghostRegion, setGhostRegion] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Connection creation state
  const [connectingFromPos, setConnectingFromPos] = useState<{ x: number; y: number } | null>(null);
  const [tempLineEnd, setTempLineEnd] = useState<{ x: number; y: number } | null>(null);

  // Label editing state
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>('');

  // Pending node updates for auto-save
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, { x: number; y: number }>>(
    {}
  );

  // Canvas V2: 节点编辑状态
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeContent, setEditingNodeContent] = useState<string>('');
  const [editingNodeColor, setEditingNodeColor] = useState<string>('');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Initialize canvas and nodes, reset zoom/pan
  useEffect(() => {
    setCurrentCanvas(canvas);
    setNodes(initialNodes);
    setConnections(initialConnections);
    // Reset zoom and position when canvas changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [
    canvas,
    initialNodes,
    initialConnections,
    setCurrentCanvas,
    setNodes,
    setConnections,
    setScale,
    setPosition,
  ]);

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
      // Prevent scrolling
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

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (dragMoveFrameRef.current) cancelAnimationFrame(dragMoveFrameRef.current);
      if (mouseMoveFrameRef.current) cancelAnimationFrame(mouseMoveFrameRef.current);
    };
  }, []);

  // Handle dragging start for region creation interaction
  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Only handle if clicking on empty stage
      if (e.target !== e.target.getStage()) return;

      // Left click only
      if (e.evt.button !== 0) return;

      if (interactionMode === 'create_region') {
        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const canvasPos = toCanvasCoords(pointer, position, scale);
        setCreatingRegionStart(canvasPos);
        setSelectedNodeId(null);
        setSelectedConnectionId(null);
      }
    },
    [interactionMode, position, scale, setSelectedNodeId, setSelectedConnectionId]
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

  // Handle node drag end - update local state and recalculate connection positions
  const handleDragEnd = useCallback(
    (nodeId: string, x: number, y: number) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const deltaX = x - node.x;
      const deltaY = y - node.y;

      // 1. If Region: Move children locally (Backend handles persistence cascade)
      if (node.type === NodeTypeEnum.region) {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id === nodeId) return { ...n, x, y };
            if (n.parentId === nodeId) {
              return { ...n, x: n.x + deltaX, y: n.y + deltaY };
            }
            return n;
          })
        );

        setPendingUpdates((prev) => ({
          ...prev,
          [nodeId]: { x, y },
        }));
        return;
      }

      // 2. If Normal Node: Check grouping (collision with regions)
      const centerX = x + node.width / 2;
      const centerY = y + node.height / 2;

      const targetRegion = nodes.find(
        (r) =>
          r.type === NodeTypeEnum.region &&
          r.id !== nodeId &&
          centerX >= r.x &&
          centerX <= r.x + r.width &&
          centerY >= r.y &&
          centerY <= r.y + r.height
      );

      const newParentId = targetRegion ? targetRegion.id : null;

      // If grouping changed, save immediately
      if (newParentId !== node.parentId) {
        // Update local state
        setNodes((prev) =>
          prev.map((n) => (n.id === nodeId ? { ...n, x, y, parentId: newParentId } : n))
        );

        // Persist
        updateNode(nodeId, { x, y, parentId: newParentId })
          .then(() => Message.info(newParentId ? '已加入区域' : '已移出区域'))
          .catch(() => Message.error('分组更新失败'));

        // Remove from pending if exists (to avoid overwrite by auto-save)
        setPendingUpdates((prev) => {
          const { [nodeId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        // Only moved, queue for auto-save
        setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
        setPendingUpdates((prev) => ({
          ...prev,
          [nodeId]: { x, y },
        }));
      }
    },
    [nodes, setNodes, setPendingUpdates]
  );

  // Handle node drag move for region highlighting (AC2)
  const dragMoveFrameRef = useRef<number>();
  const lastHoveredRegionId = useRef<string | null>(null);

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Only check if dragging a node, not the stage
      if (e.target === stage) return;

      // Optimize: Use requestAnimationFrame to avoid blocking UI thread
      if (dragMoveFrameRef.current) cancelAnimationFrame(dragMoveFrameRef.current);

      dragMoveFrameRef.current = requestAnimationFrame(() => {
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const canvasPos = toCanvasCoords(pointer, position, scale);

        // Find if we are over a region (that is not the node itself)
        const targetRegion = nodes.find(
          (r) =>
            r.type === NodeTypeEnum.region &&
            r.id !== e.target.id() && // e.target.id() should be set in CanvasNode
            canvasPos.x >= r.x &&
            canvasPos.x <= r.x + r.width &&
            canvasPos.y >= r.y &&
            canvasPos.y <= r.y + r.height
        );

        const targetRegionId = targetRegion ? targetRegion.id : null;

        // Dirty check: Only update state if changed
        if (targetRegionId !== lastHoveredRegionId.current) {
          lastHoveredRegionId.current = targetRegionId;
          setHoveredRegionId(targetRegionId);
        }
      });
    },
    [nodes, position, scale]
  );

  // Auto-save pending updates
  const savePendingUpdates = useCallback(async () => {
    const updates = { ...pendingUpdates };
    if (Object.keys(updates).length === 0) return;

    // Clear pending updates immediately to avoid duplicates
    setPendingUpdates({});
    setIsSaving(true);

    try {
      // Update all pending nodes
      await Promise.all(Object.entries(updates).map(([nodeId, pos]) => updateNode(nodeId, pos)));

      // Invalidate current canvas query to ensure fresh data on next navigation
      queryClient.invalidateQueries({ queryKey: ['canvas', canvas.id] });
      Message.success('已保存');
    } catch (error) {
      console.error('Failed to save node positions:', error);
      Message.error('保存失败');
      // Restore updates if failed
      setPendingUpdates((prev) => ({ ...updates, ...prev }));
    } finally {
      setIsSaving(false);
    }
  }, [pendingUpdates, setPendingUpdates, queryClient, canvas.id]);

  // Canvas V2: Disable auto-save for now, switched to manual save
  /*
  useAutoSave({
    data: pendingUpdates,
    onSave: savePendingUpdates,
    delay: 1000,
    enabled: Object.keys(pendingUpdates).length > 0,
  });
  */

  // Handle node selection
  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setSelectedConnectionId(null); // Deselect connection when selecting node
    },
    [setSelectedNodeId, setSelectedConnectionId]
  );

  // Handle stage click (deselect)
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Canvas V2: Only handle left clicks for deselection
      // e.evt.button === 0 is left click, 2 is right click
      // Also check for Ctrl+Click which is right click on Mac
      if (e.evt && (e.evt.button !== 0 || e.evt.ctrlKey)) {
        return;
      }

      // Only deselect if clicking on empty stage area
      if (e.target === e.target.getStage()) {
        setSelectedNodeId(null);
        setSelectedConnectionId(null);

        // Cancel connection if in progress
        if (isConnecting) {
          setIsConnecting(false);
          setConnectingFromNodeId(null);
          setConnectingFromPos(null);
          setTempLineEnd(null);
        }
      }
    },
    [
      setSelectedNodeId,
      setSelectedConnectionId,
      isConnecting,
      setIsConnecting,
      setConnectingFromNodeId,
    ]
  );

  // Canvas V2: 创建新节点
  const handleCreateNodeAt = useCallback(
    async (type: NodeTypeEnum, x: number, y: number) => {
      try {
        const response = await addNode(canvas.id, {
          type,
          x,
          y,
          content:
            type === NodeTypeEnum.annotation
              ? '新批注'
              : type === NodeTypeEnum.image
                ? ''
                : '新子想法',
        });

        setNodes((prev) => [...prev, response.data]);
        Message.success(
          type === NodeTypeEnum.annotation
            ? '批注已创建'
            : type === NodeTypeEnum.image
              ? '图片占位已创建'
              : '子想法已创建'
        );
      } catch (error) {
        Message.error('创建节点失败');
      }
    },
    [canvas.id, setNodes]
  );

  // Canvas V2: 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Message.error('图片大小不能超过 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsSaving(true);
    try {
      // 这里的 api 实例是从 @/services/api 导入的，它已经处理了 Auth Header
      const uploadRes = await queryClient.fetchQuery({
        queryKey: ['upload-image', file.name],
        queryFn: async () => {
          const { data } = await api.post('/meta/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return data;
        },
      });

      const imageUrl = uploadRes.url;

      // Calculate center of current view
      const stage = stageRef.current;
      if (stage) {
        const centerX = (stage.width() / 2 - position.x) / scale;
        const centerY = (stage.height() / 2 - position.y) / scale;

        const response = await addNode(canvas.id, {
          type: NodeTypeEnum.image,
          x: centerX,
          y: centerY,
          imageUrl,
          content: '', // 图片节点内容为空
        });

        setNodes((prev) => [...prev, response.data]);
        Message.success('图片已上传并添加到画布');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      Message.error('图片上传失败');
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Canvas V2: 双击编辑节点
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      // 主想法节点不可编辑
      if (node.type === NodeTypeEnum.master_idea) {
        Message.info('主想法节点不可编辑');
        return;
      }

      // 图片节点不可编辑内容
      if (node.type === NodeTypeEnum.image) {
        Message.info('图片节点不可编辑');
        return;
      }

      setEditingNodeId(nodeId);
      setEditingNodeContent(node.content || '');
      setEditingNodeColor(node.color || '');
    },
    [nodes]
  );

  // Canvas V2: 保存节点内容
  const handleSaveNodeContent = useCallback(async () => {
    if (!editingNodeId) return;

    try {
      const response = await updateNode(editingNodeId, {
        content: editingNodeContent,
        color: editingNodeColor || undefined,
      });
      setNodes((prev) =>
        prev.map((n) =>
          n.id === editingNodeId
            ? { ...n, content: response.data.content, color: response.data.color }
            : n
        )
      );
      Message.success('已保存');
    } catch (error) {
      Message.error('保存失败');
    }

    setEditingNodeId(null);
    setEditingNodeContent('');
    setEditingNodeColor('');
  }, [editingNodeId, editingNodeContent, editingNodeColor, setNodes]);

  // Connection creation handlers
  const handleConnectionStart = useCallback(
    (nodeId: string, handlePos: { x: number; y: number }) => {
      setIsConnecting(true);
      setConnectingFromNodeId(nodeId);
      setConnectingFromPos(handlePos);
      setTempLineEnd(handlePos);
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    },
    [setIsConnecting, setConnectingFromNodeId, setSelectedNodeId, setSelectedConnectionId]
  );

  // Unified mouse move handler
  const mouseMoveFrameRef = useRef<number>();

  const handleStageMouseMove = useCallback(() => {
    if (mouseMoveFrameRef.current) cancelAnimationFrame(mouseMoveFrameRef.current);

    mouseMoveFrameRef.current = requestAnimationFrame(() => {
      // Handle connection creation
      if (isConnecting && connectingFromPos) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const canvasPos = toCanvasCoords(pointer, position, scale);
        setTempLineEnd(canvasPos);
        return;
      }

      // Handle region creation
      if (creatingRegionStart) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const currentPos = toCanvasCoords(pointer, position, scale);

        const width = currentPos.x - creatingRegionStart.x;
        const height = currentPos.y - creatingRegionStart.y;

        const newGhostRegion = {
          x: width > 0 ? creatingRegionStart.x : currentPos.x,
          y: height > 0 ? creatingRegionStart.y : currentPos.y,
          width: Math.abs(width),
          height: Math.abs(height),
        };

        // Dirty check: Only update if changed (Deep check simplified because simple object)
        setGhostRegion((prev) => {
          if (
            prev &&
            prev.x === newGhostRegion.x &&
            prev.y === newGhostRegion.y &&
            prev.width === newGhostRegion.width &&
            prev.height === newGhostRegion.height
          ) {
            return prev;
          }
          return newGhostRegion;
        });
      }
    });
  }, [isConnecting, connectingFromPos, position, scale, creatingRegionStart]);

  // Unified mouse up handler
  const handleStageMouseUp = useCallback(async () => {
    // Handle region creation
    if (creatingRegionStart && ghostRegion) {
      if (ghostRegion.width > 20 && ghostRegion.height > 20) {
        try {
          const response = await addNode(canvas.id, {
            type: NodeTypeEnum.region,
            x: ghostRegion.x,
            y: ghostRegion.y,
            width: ghostRegion.width,
            height: ghostRegion.height,
            content: '新建区域',
            color: DEFAULT_REGION_COLOR,
          });
          setNodes((prev) => [...prev, response.data]);
          Message.success('区域已创建');
        } catch (e) {
          Message.error('创建区域失败');
        }
      }
      setCreatingRegionStart(null);
      setGhostRegion(null);
      setInteractionMode('select'); // Reset mode
      return;
    } else if (creatingRegionStart) {
      // Did not create valid region (e.g. click without drag)
      setCreatingRegionStart(null);
      setGhostRegion(null);
      return; // Keep mode? Or reset?
    }

    if (!isConnecting || !connectingFromNodeId) return;

    // ... existing connection logic ...
    // Check if we're over a node
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) {
      setIsConnecting(false);
      setConnectingFromNodeId(null);
      setConnectingFromPos(null);
      setTempLineEnd(null);
      return;
    }

    const canvasPos = toCanvasCoords(pointer, position, scale);

    // Find target node
    const targetNode = nodes.find((node) => {
      return (
        canvasPos.x >= node.x &&
        canvasPos.x <= node.x + node.width &&
        canvasPos.y >= node.y &&
        canvasPos.y <= node.y + node.height
      );
    });

    if (targetNode && targetNode.id !== connectingFromNodeId) {
      const existingConnection = connections.find(
        (conn) =>
          (conn.fromNodeId === connectingFromNodeId && conn.toNodeId === targetNode.id) ||
          (conn.fromNodeId === targetNode.id && conn.toNodeId === connectingFromNodeId)
      );

      if (existingConnection) {
        Message.warning('连线已存在');
      } else {
        try {
          const response = await addConnection(canvas.id, {
            fromNodeId: connectingFromNodeId,
            toNodeId: targetNode.id,
          });
          setConnections((prev) => [...prev, response.data]);
          Message.success('连线已创建');
        } catch (error) {
          console.error('Failed to create connection:', error);
          Message.error('创建连线失败');
        }
      }
    }

    setIsConnecting(false);
    setConnectingFromNodeId(null);
    setConnectingFromPos(null);
    setTempLineEnd(null);
  }, [
    creatingRegionStart,
    ghostRegion,
    canvas.id,
    setNodes,
    setInteractionMode,
    isConnecting,
    connectingFromNodeId,
    nodes,
    connections,
    position,
    scale,
    setIsConnecting,
    setConnectingFromNodeId,
    setConnections,
  ]);

  // Handle connection click (select)
  const handleConnectionClick = useCallback(
    (connectionId: string) => {
      setSelectedConnectionId(connectionId);
      setSelectedNodeId(null);
    },
    [setSelectedConnectionId, setSelectedNodeId]
  );

  // Handle connection double click (edit label)
  const handleConnectionDblClick = useCallback(
    (connectionId: string) => {
      const connection = connections.find((c) => c.id === connectionId);
      setEditingConnectionId(connectionId);
      setEditingLabel(connection?.label || '');
    },
    [connections]
  );

  // Save connection label
  const handleSaveLabel = useCallback(async () => {
    if (!editingConnectionId) return;

    console.log('[DEBUG] handleSaveLabel called:', {
      connectionId: editingConnectionId,
      label: editingLabel,
    });

    try {
      const response = await updateConnection(editingConnectionId, {
        label: editingLabel || undefined,
      });
      console.log('[DEBUG] updateConnection success:', response);
      setConnections((prev) =>
        prev.map((conn) => (conn.id === editingConnectionId ? response.data : conn))
      );
      Message.success('标注已保存');
    } catch (error) {
      console.error('[DEBUG] updateConnection failed:', error);
      Message.error('保存标注失败');
    }

    setEditingConnectionId(null);
    setEditingLabel('');
  }, [editingConnectionId, editingLabel, setConnections]);

  // Handle delete key for connections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedConnectionId) {
          Modal.confirm({
            title: '确定删除这条连线吗？',
            okText: '确定',
            cancelText: '取消',
            okButtonProps: { status: 'danger' },
            onOk: async () => {
              try {
                await deleteConnection(selectedConnectionId);
                setConnections((prev) => prev.filter((conn) => conn.id !== selectedConnectionId));
                setSelectedConnectionId(null);
                Message.success('连线已删除');
              } catch (error) {
                console.error('Failed to delete connection:', error);
                Message.error('删除连线失败');
              }
            },
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConnectionId, setConnections, setSelectedConnectionId]);

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

  // Helper: Get absolute handle positions for a node
  const getNodeHandles = (node: CanvasNodeType) => {
    // These offsets must match those used in CanvasNode.tsx
    // Top: x + width/2, y
    // Bottom: x + width/2, y + height
    // Left: x, y + height/2
    // Right: x + width, y + height/2
    return {
      top: { x: node.x + node.width / 2, y: node.y },
      bottom: { x: node.x + node.width / 2, y: node.y + node.height },
      left: { x: node.x, y: node.y + node.height / 2 },
      right: { x: node.x + node.width, y: node.y + node.height / 2 },
    };
  };

  // Helper: Find valid handles (top/bottom/left/right) for connection
  // Calculates the shortest distance between any pair of handles from both nodes
  const getClosestHandles = useCallback(
    (nodeAId: string, nodeBId: string) => {
      const nodeA = nodes.find((n) => n.id === nodeAId);
      const nodeB = nodes.find((n) => n.id === nodeBId);

      if (!nodeA || !nodeB) {
        return {
          from: { x: 0, y: 0 },
          to: { x: 0, y: 0 },
        };
      }

      const handlesA = getNodeHandles(nodeA);
      const handlesB = getNodeHandles(nodeB);

      let minDistance = Infinity;
      let closestPair = {
        from: handlesA.right, // Default fallback
        to: handlesB.left,
      };

      Object.values(handlesA).forEach((posA) => {
        Object.values(handlesB).forEach((posB) => {
          const dist = Math.hypot(posB.x - posA.x, posB.y - posA.y);
          if (dist < minDistance) {
            minDistance = dist;
            closestPair = { from: posA, to: posB };
          }
        });
      });

      return closestPair;
    },
    [nodes]
  );

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
        draggable={!isConnecting && !creatingRegionStart && interactionMode !== 'create_region'}
        onMouseDown={handleStageMouseDown}
        onWheel={handleWheel}
        onDragEnd={handleStageDragEnd}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDblClick={handleStageDblClick}
        onDblTap={handleStageDragEnd}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onDragMove={handleDragMove}
        onContextMenu={(e) => {
          // Block browser context menu to keep canvas clean
          if (e.evt) e.evt.preventDefault();
        }}
      >
        <Layer>
          {/* Render connections first (below nodes) */}
          {connections.map((conn) => {
            const { from: fromPos, to: toPos } = getClosestHandles(conn.fromNodeId, conn.toNodeId);
            return (
              <ConnectionLine
                key={conn.id}
                fromX={fromPos.x}
                fromY={fromPos.y}
                toX={toPos.x}
                toY={toPos.y}
                label={conn.label || undefined}
                selected={conn.id === selectedConnectionId}
                onClick={() => handleConnectionClick(conn.id)}
                onDblClick={() => handleConnectionDblClick(conn.id)}
              />
            );
          })}

          {/* Temporary connection line during creation */}
          {isConnecting && connectingFromPos && tempLineEnd && (
            <Line
              points={[connectingFromPos.x, connectingFromPos.y, tempLineEnd.x, tempLineEnd.y]}
              stroke="#6366f1"
              strokeWidth={2}
              dash={[10, 5]}
              lineCap="round"
              listening={false}
            />
          )}

          {/* Ghost region while creating */}
          {ghostRegion && (
            <Rect
              x={ghostRegion.x}
              y={ghostRegion.y}
              width={ghostRegion.width}
              height={ghostRegion.height}
              fill="rgba(139, 92, 246, 0.1)"
              stroke="#8b5cf6"
              strokeWidth={2}
              dash={[5, 5]}
              listening={false}
            />
          )}

          {/* Render nodes */}
          {nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              isConnectionTarget={isConnecting && node.id !== connectingFromNodeId}
              isHovered={hoveredRegionId === node.id}
              onSelect={handleNodeSelect}
              onDragEnd={handleDragEnd}
              onConnectionStart={handleConnectionStart}
              isConnectingFrom={isConnecting && node.id === connectingFromNodeId}
              onDoubleClick={handleNodeDoubleClick} /* Canvas V2 */
            />
          ))}
        </Layer>
      </Stage>

      {/* Canvas Toolbars - Portaled to Header */}
      {mounted &&
        document.getElementById('canvas-toolbar-portal') &&
        createPortal(
          <CanvasToolbar
            onAddNode={(type) => {
              if (type === NodeTypeEnum.image) {
                fileInputRef.current?.click();
                return;
              }
              if (type === NodeTypeEnum.region) {
                setInteractionMode('create_region');
                Message.info('请在画布上拖拽创建区域');
                return;
              }
              // Calculate center of current view
              const stage = stageRef.current;
              if (stage) {
                const centerX = (stage.width() / 2 - position.x) / scale;
                const centerY = (stage.height() / 2 - position.y) / scale;
                handleCreateNodeAt(type, centerX, centerY);
              }
            }}
            onSave={savePendingUpdates}
            isSaving={isSaving}
            hasPendingUpdates={Object.keys(pendingUpdates).length > 0}
          />,
          document.getElementById('canvas-toolbar-portal')!
        )}

      {/* Hidden file input for image nodes */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <ZoomIndicator onReset={handleResetView} />

      {/* Label editing modal */}
      <Modal
        title="编辑标注"
        visible={!!editingConnectionId}
        onOk={handleSaveLabel}
        onCancel={() => {
          setEditingConnectionId(null);
          setEditingLabel('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <Input.TextArea
          value={editingLabel}
          onChange={(val) => setEditingLabel(val)}
          placeholder="输入连线标注..."
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Modal>

      {/* Canvas V2: 节点内容编辑模态框 */}
      <Modal
        title={
          nodes.find((n) => n.id === editingNodeId)?.type === NodeTypeEnum.region
            ? '编辑区域属性'
            : '编辑节点内容'
        }
        visible={!!editingNodeId}
        onOk={handleSaveNodeContent}
        onCancel={() => {
          setEditingNodeId(null);
          setEditingNodeContent('');
          setEditingNodeColor('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <Space direction="vertical" className="w-full" size="medium">
          <div>
            <div className="mb-2 text-slate-400 text-xs">名称/内容</div>
            <Input.TextArea
              value={editingNodeContent}
              onChange={(val) => setEditingNodeContent(val)}
              placeholder="输入内容..."
              autoSize={{ minRows: 3, maxRows: 8 }}
            />
          </div>

          {nodes.find((n) => n.id === editingNodeId)?.type === NodeTypeEnum.region && (
            <div>
              <div className="mb-2 text-slate-400 text-xs">背景颜色</div>
              <Space wrap>
                {REGION_COLORS.map((c) => (
                  <div
                    key={c}
                    className={`w-8 h-8 rounded cursor-pointer border-2 transition-all ${editingNodeColor === c ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setEditingNodeColor(c)}
                  />
                ))}
              </Space>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
}
