import { Group, Rect, Text, Circle } from 'react-konva';
import { CanvasNode as CanvasNodeType } from '../services/canvas.service';

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onDragEnd?: (nodeId: string, x: number, y: number) => void;
  onConnectionStart?: (nodeId: string) => void;
  isConnectingFrom?: boolean;
}

export function CanvasNode({
  node,
  isSelected = false,
  onSelect,
  onDragEnd,
  onConnectionStart,
  isConnectingFrom = false,
}: CanvasNodeProps) {
  const handleDragEnd = (e: any) => {
    const newX = e.target.x();
    const newY = e.target.y();
    onDragEnd?.(node.id, newX, newY);
  };

  const handleConnectionStart = () => {
    onConnectionStart?.(node.id);
  };

  const getHandlePosition = (handle: 'top' | 'bottom' | 'left' | 'right') => {
    const { x, y, width, height } = node;
    switch (handle) {
      case 'top':
        return { x: x + width / 2, y: y };
      case 'bottom':
        return { x: x + width / 2, y: y + height };
      case 'left':
        return { x: x, y: y + height / 2 };
      case 'right':
        return { x: x + width, y: y + height / 2 };
    }
  };

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={!isConnectingFrom}
      onClick={() => onSelect?.(node.id)}
      onTap={() => onSelect?.(node.id)}
      onDragEnd={handleDragEnd}
    >
      {/* Connection handles */}
      {!isConnectingFrom && (
        <>
          <Circle
            x={getHandlePosition('top').x}
            y={getHandlePosition('top').y}
            radius={6}
            fill="#3b82f6"
            opacity={0.5}
            onMouseDown={handleConnectionStart}
            listening={false}
          />
          <Circle
            x={getHandlePosition('bottom').x}
            y={getHandlePosition('bottom').y}
            radius={6}
            fill="#3b82f6"
            opacity={0.5}
            onMouseDown={handleConnectionStart}
            listening={false}
          />
          <Circle
            x={getHandlePosition('left').x}
            y={getHandlePosition('left').y}
            radius={6}
            fill="#3b82f6"
            opacity={0.5}
            onMouseDown={handleConnectionStart}
            listening={false}
          />
          <Circle
            x={getHandlePosition('right').x}
            y={getHandlePosition('right').y}
            radius={6}
            fill="#3b82f6"
            opacity={0.5}
            onMouseDown={handleConnectionStart}
            listening={false}
          />
        </>
      )}

      {/* Background */}
      <Rect
        width={node.width}
        height={node.height}
        fill={isSelected ? '#1e3a5f' : '#1e293b'}
        stroke={isSelected ? '#3b82f6' : '#334155'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 5}
        shadowOpacity={0.3}
        shadowOffset={{ x: 2, y: 2 }}
      />

      {/* Text content */}
      <Text
        text={node.content || '空节点'}
        fill="#e2e8f0"
        fontSize={14}
        fontFamily="system-ui, -apple-system, sans-serif"
        padding={12}
        width={node.width - 24}
        height={node.height - 24}
        align="center"
        verticalAlign="middle"
        wrap="word"
        ellipsis
      />
    </Group>
  );
}
