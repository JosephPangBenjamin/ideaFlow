import { memo } from 'react';
import { Line, Circle, Text, Tag } from 'react-konva';

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
  onLabelChange,
}: ConnectionLineProps) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  return (
    <>
      <Line
        points={[fromX, fromY, toX, toY]}
        stroke={selected ? '#8B5CF6' : '#6366f1'}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        onClick={onClick}
        onDblClick={onDblClick}
      />
      {label && onLabelChange && (
        <>
          <Tag
            x={midX}
            y={midY}
            fill="#1e293b"
            opacity={0.8}
            offset={{ x: -50, y: -12 }}
            listening={false}
            onClick={() => onLabelChange(label)}
          >
            <Text
              text={label}
              fill="#e2e8f0"
              padding={8}
              fontSize={12}
              width={100}
              align="center"
            />
          </Tag>
        </>
      )}
      {label && !onLabelChange && (
        <>
          <Tag
            x={midX}
            y={midY}
            fill="#1e293b"
            opacity={0.8}
            offset={{ x: -50, y: -12 }}
            listening={false}
          >
            <Text
              text={label}
              fill="#e2e8f0"
              padding={8}
              fontSize={12}
              width={100}
              align="center"
            />
          </Tag>
        </>
      )}
      <Circle
        x={fromX}
        y={fromY}
        radius={3}
        fill={selected ? '#8B5CF6' : '#6366f1'}
        listening={false}
      />
      <Circle
        x={toX}
        y={toY}
        radius={3}
        fill={selected ? '#8B5CF6' : '#6366f1'}
        listening={false}
      />
    </>
  );
});
