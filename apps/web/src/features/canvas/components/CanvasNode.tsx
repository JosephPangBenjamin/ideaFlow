import React, { useState } from 'react';
import { Group, Rect, Text, Circle, Image as KonvaImage, Path } from 'react-konva';
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
    // Readonly nodes should still be movable (User request)
    draggable: baseStyle.draggable ?? true,
  };

  const isReadonly = !!customStyle.readonly;
  // User Requirement: Readonly nodes (sources) should be movable (draggable) but not editable/deletable.
  // So we remove !isReadonly from dragging logic.
  const canDrag = style.draggable && !isConnectingFrom;

  const handleDragEnd = (e: any) => {
    if (!canDrag) return;
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
      const content =
        node.content ||
        node.idea?.content ||
        (nodeType === NodeTypeEnum.master_idea ? '主想法' : '双击编辑');

      // Special rendering for Link Source Nodes
      if (customStyle.isSource && customStyle.sourceType === 'link' && customStyle.sourceUrl) {
        // We can't render complex HTML/JSX inside Konva Text easily without getting messy.
        // Konva Text is simple string.
        // Strategy: If it's a link, we might want to append the URL or just show the URL if content is empty.
        // But user wants to see the link address.
        // Let's format it: "Title\nURL"
        try {
          const urlObj = new URL(customStyle.sourceUrl);
          return `${content}\n🔗 ${urlObj.hostname}${urlObj.pathname.length > 1 ? '...' : ''}`;
        } catch (e) {
          return `${content}\n🔗 ${customStyle.sourceUrl}`;
        }
      }
      return content;
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

      {/* Image Node Content */}
      {nodeType === NodeTypeEnum.image && node.imageUrl && (
        <ImageContent url={node.imageUrl} width={node.width} height={node.height} />
      )}

      {/* Text Content */}
      {nodeType !== NodeTypeEnum.image && (
        <Text
          x={10}
          y={10}
          width={node.width - 20}
          height={node.height - 20}
          text={getNodeContent()}
          fontSize={style.fontSize}
          fill={style.textColor}
          fontFamily="Inter, system-ui, sans-serif"
          align="center"
          verticalAlign="middle"
          wrap="word"
          ellipsis={true}
          listening={false} // Pass events to Group
        />
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

      {/* Idea Source Indicator */}
      {/* Idea Source Indicator - Show distinct types */}
      {node.idea?.sources && node.idea.sources.length > 0 && (
        <Group
          x={
            node.width - (Math.min(new Set(node.idea.sources.map((s) => s.type)).size, 3) * 16 + 8)
          }
          y={4}
          listening={false}
        >
          {/* Background pill */}
          <Rect
            width={Math.min(new Set(node.idea.sources.map((s) => s.type)).size, 3) * 16 + 4}
            height={16}
            fill="#1e293b"
            cornerRadius={8}
            opacity={0.8}
          />
          {Array.from(new Set(node.idea.sources.map((s) => s.type)))
            .slice(0, 3)
            .map((type, index) => (
              <Group key={type} x={index * 16 + 2} y={0}>
                {type === 'link' ? (
                  <Path
                    data="M10 4H14V8M14 4L9 9M9 4H5C4.44772 4 4 4.44772 4 5V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V11"
                    fill="#60a5fa"
                    scale={{ x: 0.5, y: 0.5 }}
                    x={4}
                    y={4}
                  />
                ) : type === 'image' ? (
                  <Path
                    data="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"
                    fill="#34d399"
                    scale={{ x: 0.35, y: 0.35 }}
                    x={4}
                    y={4}
                  />
                ) : (
                  <Path
                    data="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                    fill="#fbbf24"
                    scale={{ x: 0.35, y: 0.35 }}
                    x={4}
                    y={4}
                  />
                )}
              </Group>
            ))}
        </Group>
      )}

      {/* Connection handles - MUST be rendered AFTER Rect and Text to be on top */}
      {(!isConnectingFrom || isConnectionTarget) && !isReadonly && (
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
    // Check for source updates
    prev.node.idea?.sources?.length === next.node.idea?.sources?.length &&
    prev.node.idea?.sources?.[0]?.type === next.node.idea?.sources?.[0]?.type &&
    shallowEqualStyle(prev.node.style, next.node.style)
  );
});
