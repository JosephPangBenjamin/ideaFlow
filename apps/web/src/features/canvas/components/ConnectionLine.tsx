import { memo } from 'react';
import { Line, Circle, Text, Tag, Label, Group } from 'react-konva';

interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label?: string;
  selected?: boolean;
  onClick?: () => void;
  onDblClick?: () => void;
  onLabelChange?: (label: string) => void;
}

export const ConnectionLine = memo(function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  label,
  selected = false,
  onClick,
  onDblClick,
}: ConnectionLineProps) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  return (
    <Group>
      <Line
        points={[fromX, fromY, toX, toY]}
        stroke={selected ? '#8B5CF6' : '#6366f1'}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        onClick={onClick}
        onDblClick={onDblClick}
        onTap={onClick}
        onDblTap={onDblClick}
        hitStrokeWidth={10}
      />
      {label && (
        <Label x={midX} y={midY} offsetX={50} offsetY={10}>
          <Tag fill="#1e293b" opacity={0.9} cornerRadius={4} pointerDirection="none" />
          <Text text={label} fill="#e2e8f0" padding={6} fontSize={12} width={100} align="center" />
        </Label>
      )}
      <Circle
        x={fromX}
        y={fromY}
        radius={4}
        fill={selected ? '#8B5CF6' : '#6366f1'}
        listening={false}
      />
      <Circle
        x={toX}
        y={toY}
        radius={4}
        fill={selected ? '#8B5CF6' : '#6366f1'}
        listening={false}
      />
    </Group>
  );
});
