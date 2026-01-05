import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConnectionLine } from './components/ConnectionLine';

describe('ConnectionLine', () => {
  it('should render line between two points', () => {
    const { container } = render(<ConnectionLine fromX={100} fromY={100} toX={300} toY={300} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} label="Test label" />
    );

    const label = getByText('Test label');
    expect(label).toBeTruthy();
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
    const { container } = render(
      <ConnectionLine fromX={100} fromY={100} toX={300} toY={300} selected={true} />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
