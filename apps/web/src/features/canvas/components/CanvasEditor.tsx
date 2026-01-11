import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { api } from '@/services/api';
import { Stage, Layer, Line, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useAtom } from 'jotai';
import {
  Message,
  Drawer,
  Form,
  Input,
  Button,
  Modal,
  Slider,
  ColorPicker,
  Upload,
} from '@arco-design/web-react';
import {
  IconDelete,
  IconEdit,
  IconLoading,
  IconSettings,
  IconUpload,
} from '@arco-design/web-react/icon';
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
  interactionModeAtom,
} from '../stores/canvasAtoms';
import { useAutoSave } from '../hooks/useAutoSave';
import { calculateZoom, toCanvasCoords } from '../utils/canvasUtils';
import { DEFAULT_REGION_COLOR } from '../utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import {
  updateNode,
  addNode,
  addConnection,
  updateConnection,
  deleteConnection,
  deleteNode,
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

// Internal component for image selection in the sidebar
function SidebarImageUpload({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Using existing upload endpoint
      const response = await api.post('/meta/preview-url', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(response.data.url);
      Message.success('上传成功');
    } catch (error) {
      console.error('Upload failed:', error);
      Message.error('上传失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="text-[12px] font-medium text-slate-400 mb-2 uppercase tracking-wider">
        {label}
      </div>
      <Upload
        showUploadList={false}
        customRequest={(options) => {
          handleUpload(options.file as File);
        }}
      >
        <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-blue-500/50 transition-all bg-white/5 h-28 flex items-center justify-center backdrop-blur-sm">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <IconEdit style={{ fontSize: 24 }} className="text-white" />
              </div>
            </>
          ) : (
            <div className="text-slate-500 flex flex-col items-center">
              <IconUpload style={{ fontSize: 32 }} />
              <span className="text-[11px] mt-2 font-medium">点击上传图片</span>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-sm">
              <IconLoading className="animate-spin text-blue-400" style={{ fontSize: 24 }} />
            </div>
          )}
        </div>
      </Upload>
    </div>
  );
}

export function CanvasEditor({
  canvas,
  initialNodes = [],
  initialConnections = [],
}: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
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
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const [form] = Form.useForm();

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

  useAutoSave({
    data: pendingUpdates,
    onSave: savePendingUpdates,
    delay: 1000,
    enabled: Object.keys(pendingUpdates).length > 0,
    onlyOnUnmount: true,
  });

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

  // Canvas V2: 编辑节点
  const handleNodeEdit = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      // 主想法节点不可编辑
      if (node.type === NodeTypeEnum.master_idea) {
        Message.info('主想法节点不可编辑');
        return;
      }

      // Readonly nodes (sources) cannot be edited
      if ((node as any).style?.readonly) {
        Message.info('只读节点不可编辑');
        return;
      }

      setEditingNodeId(nodeId);
      setIsDrawerVisible(true);

      // Update form values
      form.setFieldsValue({
        content: node.content || '',
        color: node.color || '',
        fontSize: node.style?.fontSize || (node.type === NodeTypeEnum.region ? 12 : 14),
        textColor:
          node.style?.textColor || (node.type === NodeTypeEnum.region ? '#ffffff' : '#f8fafc'),
        fill: node.style?.fill || node.color || '',
        stroke: node.style?.stroke || '',
      });
    },
    [nodes, form]
  );

  // Canvas V2: 双击编辑节点
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      handleNodeEdit(nodeId);
    },
    [handleNodeEdit]
  );

  // Canvas V2: 保存节点内容
  const handleSaveNodeContent = useCallback(async () => {
    if (!editingNodeId) return;

    try {
      const values = await form.validate();
      const node = nodes.find((n) => n.id === editingNodeId);
      if (!node) return;

      const style = {
        ...((node.style as any) || {}),
        fontSize: values.fontSize,
        textColor: values.textColor,
        fill: values.fill,
        stroke: values.stroke,
      };

      const updateData: any = {
        content: values.content,
        color: values.color || undefined,
        style,
      };

      const response = await updateNode(editingNodeId, updateData);
      setNodes((prev) =>
        prev.map((n) => (n.id === editingNodeId ? { ...n, ...response.data } : n))
      );
      Message.success('已保存');
    } catch (error) {
      console.error('Save failed:', error);
      Message.error('保存失败');
    }

    setEditingNodeId(null);
    setIsDrawerVisible(false);
  }, [editingNodeId, nodes, form, setNodes]);

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
      // Allow infinite connections - no duplicate check
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

  // Handle delete key for connections and nodes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if editing in an input/textarea
      if (
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected node
        if (selectedNodeId) {
          const nodeToDelete = nodes.find((n) => n.id === selectedNodeId);
          if (!nodeToDelete) return;

          if (nodeToDelete.type === NodeTypeEnum.master_idea) {
            Message.warning('主想法节点不可删除');
            return;
          }

          if ((nodeToDelete as any).style?.readonly) {
            Message.warning('该节点为只读，无法删除');
            return;
          }

          Modal.confirm({
            title: '确定删除此节点吗？',
            content: '相关的连线也将被删除。',
            okText: '确定',
            cancelText: '取消',
            okButtonProps: { status: 'danger' },
            onOk: async () => {
              try {
                await deleteNode(selectedNodeId);
                // Remove node and related connections
                // For regions: orphan children by clearing parentId (consistent with backend onDelete: SetNull)
                setNodes((prev) =>
                  prev
                    .filter((n) => n.id !== selectedNodeId)
                    .map((n) => (n.parentId === selectedNodeId ? { ...n, parentId: null } : n))
                );
                setConnections((prev) =>
                  prev.filter(
                    (conn) => conn.fromNodeId !== selectedNodeId && conn.toNodeId !== selectedNodeId
                  )
                );
                setSelectedNodeId(null);
                Message.success('节点已删除');
              } catch (error) {
                console.error('Failed to delete node:', error);
                Message.error('删除节点失败');
              }
            },
          });
        } else if (selectedConnectionId) {
          // Delete selected connection
          const conn = connections.find((c) => c.id === selectedConnectionId);
          if (conn) {
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = nodes.find((n) => n.id === conn.toNodeId);
            const isReadonlyConnection =
              (fromNode as any)?.style?.readonly || (toNode as any)?.style?.readonly;

            if (isReadonlyConnection) {
              Message.warning('无法删除与只读节点关联的连线');
              return;
            }
          }

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
  }, [
    selectedNodeId,
    nodes,
    selectedConnectionId,
    connections,
    setNodes,
    setConnections,
    setSelectedNodeId,
    setSelectedConnectionId,
    deleteNode, // Assuming deleteNode is a dependency
    deleteConnection, // Assuming deleteConnection is a dependency
  ]);

  // Attach transformer to selected node
  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (selectedNodeId) {
      // Find the Konva node by id
      const selectedKonvaNode = stage.findOne(`#${selectedNodeId}`);
      if (selectedKonvaNode) {
        tr.nodes([selectedKonvaNode]);
        tr.getLayer()?.batchDraw();
      } else {
        tr.nodes([]);
      }
    } else {
      tr.nodes([]);
    }
  }, [selectedNodeId, nodes]); // Re-run when nodes change (e.g. after resize)

  // Handle transform end (resize)
  const handleTransformEnd = useCallback(
    async (nodeId: string) => {
      const stage = stageRef.current;
      if (!stage) return;

      const konvaNode = stage.findOne(`#${nodeId}`);
      if (!konvaNode) return;

      // Get the new size (accounting for scale applied by transformer)
      const scaleX = konvaNode.scaleX();
      const scaleY = konvaNode.scaleY();
      const newWidth = Math.max(50, Math.round(konvaNode.width() * scaleX));
      const newHeight = Math.max(30, Math.round(konvaNode.height() * scaleY));
      const newX = Math.round(konvaNode.x());
      const newY = Math.round(konvaNode.y());

      // Reset scale to 1 after calculating new size
      konvaNode.scaleX(1);
      konvaNode.scaleY(1);

      const nodeToUpdate = nodes.find((n) => n.id === nodeId);
      if (!nodeToUpdate) return;

      const oldWidth = nodeToUpdate.width;
      const oldHeight = nodeToUpdate.height;
      const oldX = nodeToUpdate.x;
      const oldY = nodeToUpdate.y;

      // Update local state immediately for the parent node
      const updatedParent = {
        ...nodeToUpdate,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };

      let updatedNodes = nodes.map((n) => (n.id === nodeId ? updatedParent : n));

      // Handle proportional resizing for children if parent is a region
      const childUpdates: Array<Promise<any>> = [];
      if (nodeToUpdate.type === NodeTypeEnum.region) {
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;

        updatedNodes = updatedNodes.map((n) => {
          if (n.parentId === nodeId) {
            const relX = n.x - oldX;
            const relY = n.y - oldY;
            const updatedChild = {
              ...n,
              x: Math.round(newX + relX * scaleX),
              y: Math.round(newY + relY * scaleY),
              width: Math.round(n.width * scaleX),
              height: Math.round(n.height * scaleY),
            };
            childUpdates.push(
              updateNode(n.id, {
                x: updatedChild.x,
                y: updatedChild.y,
                width: updatedChild.width,
                height: updatedChild.height,
              })
            );
            return updatedChild;
          }
          return n;
        });
      }

      setNodes(updatedNodes);

      // Save parent to backend
      try {
        await updateNode(nodeId, { x: newX, y: newY, width: newWidth, height: newHeight });
        // Save all children to backend
        if (childUpdates.length > 0) {
          await Promise.all(childUpdates);
        }
      } catch (error) {
        console.error('Failed to update node size:', error);
        Message.error('保存节点尺寸失败');
      }
    },
    [nodes, setNodes]
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

          {/* Render nodes - Regions first so they are at the bottom */}
          {[...nodes]
            .sort((a, b) => {
              if (a.type === NodeTypeEnum.region && b.type !== NodeTypeEnum.region) return -1;
              if (a.type !== NodeTypeEnum.region && b.type === NodeTypeEnum.region) return 1;
              return 0;
            })
            .map((node) => (
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

          {/* Transformer for resizing */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            keepRatio={false}
            borderStroke="#3b82f6"
            anchorStroke="#3b82f6"
            anchorFill="#1e293b"
            anchorSize={8}
            anchorCornerRadius={2}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit minimum size
              if (newBox.width < 50 || newBox.height < 30) {
                return oldBox;
              }
              return newBox;
            }}
            onTransformEnd={() => {
              if (selectedNodeId) {
                handleTransformEnd(selectedNodeId);
              }
            }}
          />
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

      <Drawer
        width={380}
        title={
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-xl shadow-black/10 transition-transform group-hover:scale-110">
              <IconSettings style={{ fontSize: 20, color: '#60a5fa' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-0.5">
                Editor
              </div>
              <h2 className="text-lg font-heading font-bold text-white tracking-tight leading-none">
                节点样式编辑
              </h2>
            </div>
          </div>
        }
        visible={isDrawerVisible}
        onOk={handleSaveNodeContent}
        onCancel={() => setIsDrawerVisible(false)}
        okText="确认修改"
        cancelText="取消"
        className="canvas-node-drawer"
        footer={
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              className="rounded-2xl h-12 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium tracking-wide"
              onClick={() => setIsDrawerVisible(false)}
            >
              取消
            </Button>
            <Button
              type="primary"
              className="rounded-2xl h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-xl shadow-blue-500/20 font-bold transition-all duration-300 active:scale-[0.98]"
              onClick={handleSaveNodeContent}
              loading={isSaving}
            >
              完成更新
            </Button>
          </div>
        }
      >
        <div className="relative px-1 py-1 overflow-hidden min-h-full">
          {/* Dashboard-style dynamic glow effects */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <Form form={form} layout="vertical">
              {/* Basic Content */}
              {editingNodeId &&
                nodes.find((n) => n.id === editingNodeId)?.type !== NodeTypeEnum.image && (
                  <div className="mb-8">
                    <div className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.1em] flex items-center gap-2 opaciy-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]" />
                      节点内容
                    </div>
                    <Form.Item field="content" noStyle>
                      <Input.TextArea
                        className="modern-textarea"
                        autoSize={{ minRows: 3, maxRows: 8 }}
                        placeholder="在这里输入想法..."
                      />
                    </Form.Item>
                  </div>
                )}

              {/* Image Source for Image Nodes */}
              {editingNodeId &&
                nodes.find((n) => n.id === editingNodeId)?.type === NodeTypeEnum.image && (
                  <SidebarImageUpload
                    label="图片文件"
                    value={nodes.find((n) => n.id === editingNodeId)?.imageUrl || undefined}
                    onChange={(url) => {
                      setNodes((prev) =>
                        prev.map((n) => (n.id === editingNodeId ? { ...n, imageUrl: url } : n))
                      );
                    }}
                  />
                )}

              {/* Typography Section */}
              {editingNodeId &&
                nodes.find((n) => n.id === editingNodeId)?.type !== NodeTypeEnum.image && (
                  <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                    <div className="text-[11px] font-bold text-slate-400 mb-5 uppercase tracking-[0.1em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
                      文字排版
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item label="字体大小" field="fontSize">
                        <Slider min={10} max={36} step={1} showTicks />
                      </Form.Item>
                      <Form.Item label="文字颜色" field="textColor">
                        <ColorPicker className="w-full h-10" />
                      </Form.Item>
                    </div>
                  </div>
                )}

              {/* Appearance Section */}
              <div className="mb-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <div className="text-[11px] font-bold text-slate-400 mb-5 uppercase tracking-[0.1em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,1)]" />
                  视觉表现
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <Form.Item label="背景颜色" field="fill">
                    <ColorPicker showPreset className="w-full h-10" />
                  </Form.Item>
                  <Form.Item label="边框颜色" field="stroke">
                    <ColorPicker showPreset className="w-full h-10" />
                  </Form.Item>
                </div>

                {editingNodeId &&
                  nodes.find((n) => n.id === editingNodeId)?.type !== NodeTypeEnum.image && (
                    <div className="mt-4 border-t border-white/5 pt-6">
                      <SidebarImageUpload
                        label="背景图片"
                        value={
                          nodes.find((n) => n.id === editingNodeId)?.style?.backgroundImage ||
                          undefined
                        }
                        onChange={(url) => {
                          const nodeId = editingNodeId;
                          setNodes((prev) =>
                            prev.map((n) => {
                              if (n.id === nodeId) {
                                return {
                                  ...n,
                                  style: {
                                    ...((n.style as any) || {}),
                                    backgroundImage: url,
                                  },
                                };
                              }
                              return n;
                            })
                          );
                        }}
                      />
                    </div>
                  )}
              </div>

              {/* Danger Zone */}
              <div className="mt-12 pt-6 border-t border-white/5">
                <Button
                  status="danger"
                  type="secondary"
                  long
                  className="rounded-xl h-11 group transition-all hover:bg-red-500/10"
                  onClick={() => {
                    if (editingNodeId) {
                      Modal.confirm({
                        title: '确定要删除此节点吗？',
                        content: '删除后无法撤销，所有关联的连线也将被删除。',
                        okButtonProps: { status: 'danger' },
                        onOk: () => {
                          const e = new KeyboardEvent('keydown', { key: 'Delete' });
                          window.dispatchEvent(e);
                          setIsDrawerVisible(false);
                        },
                      });
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconDelete />
                    <span>删除此节点</span>
                  </div>
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Drawer>

      <style>{`
        .canvas-node-drawer .arco-drawer-content {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(24px) saturate(180%);
          color: #f1f5f9;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
        }
        .canvas-node-drawer .arco-drawer-header {
          background: rgba(30, 41, 59, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 32px 24px;
        }
        .canvas-node-drawer .arco-drawer-body {
          padding: 24px;
        }
        .canvas-node-drawer .arco-drawer-footer {
          background: rgba(15, 23, 42, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 24px;
        }
        .canvas-node-drawer .arco-drawer-title {
          color: #f1f5f9;
          width: 100%;
        }
        .canvas-node-drawer .arco-form-label-item > label {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .canvas-node-drawer .modern-textarea {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 16px !important;
          color: #ffffff !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 16px !important;
          font-size: 14px;
          line-height: 1.6;
        }
        .canvas-node-drawer .modern-textarea:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15) !important;
        }
        .canvas-node-drawer .arco-slider-button {
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        .canvas-node-drawer .arco-slider-bar {
          background-color: #3b82f6;
          height: 4px;
        }
        .canvas-node-drawer .arco-slider-rail {
          background-color: rgba(255, 255, 255, 0.1);
          height: 4px;
        }
        .canvas-node-drawer .arco-color-picker-trigger {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          height: 40px;
          transition: all 0.3s ease;
        }
        .canvas-node-drawer .arco-color-picker-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .canvas-node-drawer .arco-btn-status-danger {
          background: rgba(239, 68, 68, 0.05) !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
        }
        .canvas-node-drawer .arco-btn-status-danger:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}
