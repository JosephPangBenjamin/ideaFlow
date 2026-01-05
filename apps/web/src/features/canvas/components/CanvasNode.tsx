import { Group, Rect, Text } from 'react-konva';
import { CanvasNode as CanvasNodeType } from '../services/canvas.service';

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onDragEnd?: (nodeId: string, x: number, y: number) => void;
}

export function CanvasNode({ node, isSelected = false, onSelect, onDragEnd }: CanvasNodeProps) {
  // Get idea summary (first 50 characters)
  const ideaSummary = node.idea?.content
    ? node.idea.content.substring(0, 50) + (node.idea.content.length > 50 ? '...' : '')
    : node.content || '空节点';

  const handleDragEnd = (e: any) => {
    const newX = e.target.x();
    const newY = e.target.y();
    onDragEnd?.(node.id, newX, newY);
  };

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable
      onClick={() => onSelect?.(node.id)}
      onTap={() => onSelect?.(node.id)}
      onDragEnd={handleDragEnd}
    >
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
        text={ideaSummary}
        fill="#e2e8f0"
        fontSize={14}
        fontFamily="system-ui, -apple-system, sans-serif"
        padding={12}
        width={node.width - 24}
        height={node.height - 24}
        align="left"
        verticalAlign="top"
        wrap="word"
        ellipsis
      />
    </Group>
  );
}
