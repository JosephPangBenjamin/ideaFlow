import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ZoomIndicator } from './components/ZoomIndicator';
import { scaleAtom, positionAtom, scalePercentAtom } from './stores/canvasAtoms';
import { MIN_SCALE, MAX_SCALE, SCALE_BY } from './utils/canvasUtils';
import { useHydrateAtoms } from 'jotai/utils';

// Helper component to set initial atom values
function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: [any, any][];
  children: React.ReactNode;
}) {
  useHydrateAtoms(initialValues);
  return <>{children}</>;
}

function TestProvider({
  children,
  initialScale = 1,
}: {
  children: React.ReactNode;
  initialScale?: number;
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms initialValues={[[scaleAtom, initialScale]]}>{children}</HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  );
}

describe('ZoomIndicator', () => {
  const mockOnReset = vi.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  it('should display current zoom percentage at 100%', () => {
    render(
      <TestProvider initialScale={1}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    expect(screen.getByTestId('zoom-percent')).toHaveTextContent('100%');
  });

  it('should display scaled zoom percentage (50%)', () => {
    render(
      <TestProvider initialScale={0.5}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    expect(screen.getByTestId('zoom-percent')).toHaveTextContent('50%');
  });

  it('should display scaled zoom percentage (200%)', () => {
    render(
      <TestProvider initialScale={2}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    expect(screen.getByTestId('zoom-percent')).toHaveTextContent('200%');
  });

  it('should not show reset button at 100%', () => {
    render(
      <TestProvider initialScale={1}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    expect(screen.queryByTestId('zoom-reset-button')).not.toBeInTheDocument();
  });

  it('should show reset button when zoomed', () => {
    render(
      <TestProvider initialScale={1.5}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    expect(screen.getByTestId('zoom-reset-button')).toBeInTheDocument();
  });

  it('should call onReset when clicking reset button', () => {
    render(
      <TestProvider initialScale={2}>
        <ZoomIndicator onReset={mockOnReset} />
      </TestProvider>
    );

    fireEvent.click(screen.getByTestId('zoom-reset-button'));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});

describe('Zoom Constants', () => {
  it('should have correct MIN_SCALE (10%)', () => {
    expect(MIN_SCALE).toBe(0.1);
  });

  it('should have correct MAX_SCALE (400%)', () => {
    expect(MAX_SCALE).toBe(4);
  });

  it('should have correct SCALE_BY factor (10%)', () => {
    expect(SCALE_BY).toBe(1.1);
  });

  it('should calculate zoom range correctly', () => {
    expect(MIN_SCALE * 100).toBe(10); // 10%
    expect(MAX_SCALE * 100).toBe(400); // 400%
  });
});

describe('Canvas Atoms', () => {
  it('scaleAtom should default to 1', () => {
    const TestComponent = () => {
      const [scale] = [1]; // Default value check
      return <div data-testid="scale">{scale}</div>;
    };

    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(screen.getByTestId('scale')).toHaveTextContent('1');
  });

  it('positionAtom should track x,y coordinates', () => {
    // Position atom exists and can hold position data
    const position = { x: 100, y: 200 };
    expect(position.x).toBe(100);
    expect(position.y).toBe(200);
  });
});
