import React, { useState } from 'react';
import { Group, Rect, Text, Circle, Image as KonvaImage } from 'react-konva';
import {
  CanvasNode as CanvasNodeType,
  CanvasNodeType as NodeTypeEnum,
} from '../services/canvas.service';
import useImage from 'use-image';
import { DEFAULT_REGION_COLOR } from '../utils/constants';

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected?: boolean;
  isHovered?: boolean; // AC2: 拖拽高亮反馈
  isConnectionTarget?: boolean;
  onSelect?: (nodeId: string) => void;
  onDragEnd?: (nodeId: string, x: number, y: number) => void;
  onConnectionStart?: (nodeId: string, handlePosition: { x: number; y: number }) => void;
  isConnectingFrom?: boolean;
  onDoubleClick?: (nodeId: string) => void; // Canvas V2: 双击编辑
}

// Canvas V2: 节点类型样式配置
const nodeStyles = {
  master_idea: {
    fill: '#1a1a2e',
    stroke: '#f59e0b', // 金色边框 - 只读主想法
    strokeWidth: 2,
    strokeDash: [],
    textColor: '#fbbf24',
    draggable: false, // 主想法不可拖拽
    label: '主想法',
  },
  sub_idea: {
    fill: '#1e293b',
    stroke: '#3b82f6', // 蓝色边框 - 可编辑子想法
    strokeWidth: 1,
    strokeDash: [],
    textColor: '#e2e8f0',
    draggable: true,
    label: '子想法',
  },
  annotation: {
    fill: '#0f172a',
    stroke: '#10b981', // 绿色虚线边框 - 批注
    strokeWidth: 1,
    strokeDash: [5, 3],
    textColor: '#a7f3d0',
    draggable: true,
    label: '批注',
  },
  image: {
    fill: '#1e293b',
    stroke: '#6366f1', // 紫色边框 - 图片
    strokeWidth: 1,
    strokeDash: [],
    textColor: '#c7d2fe',
    draggable: true,
    label: '图片',
  },
  region: {
    fill: DEFAULT_REGION_COLOR,
    stroke: '#8b5cf6',
    strokeWidth: 2,
    strokeDash: [5, 5],
    textColor: '#8b5cf6',
    draggable: true,
    label: '区域',
  },
};

// 图片节点内容组件
function ImageContent({ url, width, height }: { url: string; width: number; height: number }) {
  const [image] = useImage(url);
  if (!image) {
    return (
      <Text
        text="加载中..."
        fill="#94a3b8"
        fontSize={12}
        width={width}
        height={height}
        align="center"
        verticalAlign="middle"
      />
    );
  }
  return <KonvaImage image={image} width={width - 16} height={height - 16} x={8} y={8} />;
}

// Background Image for any node type
function BackgroundImage({ url, width, height }: { url: string; width: number; height: number }) {
  const [image] = useImage(url);
  if (!image) return null;
  return (
    <KonvaImage
      image={image}
      width={width}
      height={height}
      cornerRadius={8}
      opacity={0.3}
      listening={false}
    />
  );
}

function CanvasNodeComponent({
  node,
  isSelected = false,
  isHovered = false,
  isConnectionTarget = false,
  onSelect,
  onDragEnd,
  onConnectionStart,
  isConnectingFrom = false,
  onDoubleClick,
}: CanvasNodeProps) {
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);

  // Canvas V2: 获取节点类型样式
  const nodeType = node.type || NodeTypeEnum.sub_idea;
  const baseStyle = nodeStyles[nodeType] || nodeStyles.sub_idea;

  // Merge with custom styles from the node
  const customStyle = (node as any).style || {};
  const style = {
    ...baseStyle,
    fill:
      customStyle.fill ||
      (nodeType === NodeTypeEnum.region && node.color ? node.color : baseStyle.fill),
    stroke: customStyle.stroke || baseStyle.stroke,
    strokeWidth: customStyle.strokeWidth || baseStyle.strokeWidth,
    textColor: customStyle.textColor || baseStyle.textColor,
    fontSize: customStyle.fontSize || (nodeType === NodeTypeEnum.region ? 12 : 14),
    backgroundImage: customStyle.backgroundImage || null,
  };

  const canDrag = style.draggable && !isConnectingFrom;

  const handleDragEnd = (e: any) => {
    if (!style.draggable) return;
    const newX = e.target.x();
    const newY = e.target.y();
    onDragEnd?.(node.id, newX, newY);
  };

  // Handle positions relative to the Group (which is positioned at node.x, node.y)
  const getHandlePosition = (handle: 'top' | 'bottom' | 'left' | 'right') => {
    const { width, height } = node;
    switch (handle) {
      case 'top':
        return { x: width / 2, y: 0 };
      case 'bottom':
        return { x: width / 2, y: height };
      case 'left':
        return { x: 0, y: height / 2 };
      case 'right':
        return { x: width, y: height / 2 };
    }
  };

  // Get absolute position for connection line calculations
  const getAbsoluteHandlePosition = (handle: 'top' | 'bottom' | 'left' | 'right') => {
    const relPos = getHandlePosition(handle);
    return { x: node.x + relPos.x, y: node.y + relPos.y };
  };

  const handleConnectionStart = (handle: 'top' | 'bottom' | 'left' | 'right') => {
    const absPos = getAbsoluteHandlePosition(handle);
    onConnectionStart?.(node.id, absPos);
  };

  const renderHandle = (handle: 'top' | 'bottom' | 'left' | 'right') => {
    const pos = getHandlePosition(handle);
    const isHovered = hoveredHandle === handle;
    return (
      <Circle
        key={handle}
        x={pos.x}
        y={pos.y}
        radius={isHovered ? 8 : 6}
        fill={isHovered ? '#60a5fa' : '#3b82f6'}
        opacity={isHovered ? 0.9 : 0.6}
        onMouseEnter={() => setHoveredHandle(handle)}
        onMouseLeave={() => setHoveredHandle(null)}
        onMouseDown={(e) => {
          e.cancelBubble = true; // Prevent node drag
          handleConnectionStart(handle);
        }}
        onTouchStart={(e) => {
          e.cancelBubble = true;
          handleConnectionStart(handle);
        }}
      />
    );
  };

  // Canvas V2: 获取节点显示内容
  const getNodeContent = () => {
    if (nodeType === NodeTypeEnum.master_idea || nodeType === NodeTypeEnum.sub_idea) {
      return (
        node.content ||
        node.idea?.content ||
        (nodeType === NodeTypeEnum.master_idea ? '主想法' : '双击编辑')
      );
    }
    if (nodeType === NodeTypeEnum.image) {
      return ''; // 图片节点不显示文字
    }
    return node.content || (nodeType === NodeTypeEnum.region ? '未命名区域' : '双击编辑');
  };

  return (
    <Group
      id={node.id}
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      draggable={canDrag}
      onClick={() => onSelect?.(node.id)}
      onTap={() => onSelect?.(node.id)}
      onDblClick={() => onDoubleClick?.(node.id)}
      onDblTap={() => onDoubleClick?.(node.id)}
      onDragEnd={handleDragEnd}
    >
      {/* Background */}
      <Rect
        width={node.width}
        height={node.height}
        fill={isSelected ? '#1e3a5f' : style.fill}
        stroke={isHovered ? '#ffffff' : isSelected ? '#3b82f6' : style.stroke}
        strokeWidth={isHovered ? 3 : isSelected ? 2 : style.strokeWidth}
        dash={style.strokeDash}
        cornerRadius={8}
        // Optimize: Only show shadow when selected or hovered to improve performance
        shadowColor="black"
        shadowBlur={isHovered || isSelected ? 10 : 0}
        shadowOpacity={0.3}
        shadowOffset={{ x: 2, y: 2 }}
        shadowEnabled={isHovered || isSelected} // Critical performance fix for dragging
        hitStrokeWidth={0} // Improve hit test performance
      />

      {/* Background Image if any */}
      {style.backgroundImage && (
        <BackgroundImage url={style.backgroundImage} width={node.width} height={node.height} />
      )}

      {/* Region Label - Top-Center Border Line */}
      {nodeType === NodeTypeEnum.region && (
        <Group x={node.width / 2} y={0} listening={false}>
          {/* Label background to mask the border line */}
          <Rect
            x={-(node.content?.length || 5) * 4 - 10}
            y={-10}
            width={(node.content?.length || 5) * 8 + 20}
            height={20}
            fill="#020617" // Matches bg-slate-950
          />
          <Text
            text={getNodeContent()}
            fill={style.stroke}
            fontSize={12}
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            x={-(node.width - 24) / 2}
            y={-6}
            width={node.width - 24}
          />
        </Group>
      )}

      {/* Canvas V2: 节点类型标签（仅主想法显示） */}
      {nodeType === NodeTypeEnum.master_idea && (
        <Text text="📌 主想法" fill="#f59e0b" fontSize={10} x={8} y={4} listening={false} />
      )}

      {/* Task Status Icon */}
      {node.idea?.tasks && node.idea.tasks.length > 0 && (
        <Group x={node.width - 24} y={4} listening={false}>
          {/* Background circle for icon visibility */}
          <Circle radius={7} fill="#1e293b" />
          {/* Status color indicator */}
          <Circle
            radius={5}
            fill={node.idea.tasks[0]?.status === 'done' ? '#10b981' : '#3b82f6'}
            stroke="#ffffff"
            strokeWidth={1}
          />
        </Group>
      )}

      {/* Image content for image type */}
      {nodeType === NodeTypeEnum.image && node.imageUrl ? (
        <ImageContent url={node.imageUrl} width={node.width} height={node.height} />
      ) : (
        /* Text content (Non-Region) */
        nodeType !== NodeTypeEnum.region && (
          <Text
            text={getNodeContent()}
            fill={style.textColor}
            fontSize={style.fontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            padding={12}
            width={node.width - 24}
            height={node.height - (nodeType === NodeTypeEnum.master_idea ? 36 : 24)}
            y={nodeType === NodeTypeEnum.master_idea ? 18 : 0}
            align="center"
            verticalAlign="middle"
            wrap="word"
            ellipsis
            listening={false}
          />
        )
      )}

      {/* Connection handles - MUST be rendered AFTER Rect and Text to be on top */}
      {(!isConnectingFrom || isConnectionTarget) && (
        <>
          {renderHandle('top')}
          {renderHandle('bottom')}
          {renderHandle('left')}
          {renderHandle('right')}
        </>
      )}
    </Group>
  );
}

// Helper: shallow compare style objects
const shallowEqualStyle = (a?: any, b?: any): boolean => {
  if (a === b) return true;
  if (!a || !b) return a === b;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
};

export const CanvasNode = React.memo(CanvasNodeComponent, (prev, next) => {
  return (
    prev.isSelected === next.isSelected &&
    prev.isHovered === next.isHovered &&
    prev.isConnectionTarget === next.isConnectionTarget &&
    prev.isConnectingFrom === next.isConnectingFrom &&
    prev.node.x === next.node.x &&
    prev.node.y === next.node.y &&
    prev.node.width === next.node.width &&
    prev.node.height === next.node.height &&
    prev.node.content === next.node.content &&
    prev.node.color === next.node.color &&
    prev.node.imageUrl === next.node.imageUrl &&
    // Check for task updates (status change or new task)
    prev.node.idea?.tasks?.[0]?.status === next.node.idea?.tasks?.[0]?.status &&
    prev.node.idea?.tasks?.length === next.node.idea?.tasks?.length &&
    shallowEqualStyle(prev.node.style, next.node.style)
  );
});
