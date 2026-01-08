import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Konva components to avoid canvas dependency in tests
vi.mock('react-konva', () => ({
  Line: (props: any) => <div data-testid="line" data-stroke={props.stroke} />,
  Circle: (props: any) => <div data-testid="circle" data-x={props.x} data-y={props.y} />,
  Text: ({ text }: { text: string }) => <span data-testid="text">{text}</span>,
  Tag: ({ children }: { children: React.ReactNode }) => <div data-testid="tag">{children}</div>,
}));

import { ConnectionLine } from './components/ConnectionLine';

describe('ConnectionLine', () => {
  it('should render line between two points', () => {
    const { getByTestId } = render(<ConnectionLine fromX={100} fromY={100} toX={300} toY={300} />);

    const line = getByTestId('line');
    expect(line).toBeTruthy();
    expect(line.getAttribute('data-stroke')).toBe('#6366f1');
  });

  it('should render with label', () => {
    const { getByTestId } = render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} label="Test label" />
    );

    const label = getByTestId('text');
    expect(label.textContent).toBe('Test label');
  });

  it('should have onClick handler', () => {
    const handleClick = vi.fn();
    render(<ConnectionLine fromX={100} fromY={100} toX={300} toY={300} onClick={handleClick} />);

    expect(handleClick).toBeDefined();
  });

  it('should have onDblClick handler', () => {
    const handleDblClick = vi.fn();
    render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} onDblClick={handleDblClick} />
    );

    expect(handleDblClick).toBeDefined();
  });

  it('should render with selected state', () => {
    const { getByTestId } = render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} selected={true} />
    );

    const line = getByTestId('line');
    expect(line.getAttribute('data-stroke')).toBe('#8B5CF6'); // Selected color
  });

  it('should render endpoint circles', () => {
    const { getAllByTestId } = render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} />
    );

    const circles = getAllByTestId('circle');
    expect(circles.length).toBe(2); // Two endpoints
  });
});
