import { describe, it, expect } from 'vitest';
import { calculateZoom, toCanvasCoords, MIN_SCALE, MAX_SCALE } from './canvasUtils';

describe('canvasUtils', () => {
  describe('toCanvasCoords', () => {
    it('should convert screen coords to canvas coords at 100% scale', () => {
      const pointer = { x: 100, y: 100 };
      const stagePos = { x: 0, y: 0 };
      const scale = 1;

      const result = toCanvasCoords(pointer, stagePos, scale);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should handle stage offset', () => {
      const pointer = { x: 100, y: 100 };
      const stagePos = { x: 50, y: 50 }; // Stage moved right/down
      const scale = 1;

      // Canvas point is effectively at 50,50 relative to origin
      const result = toCanvasCoords(pointer, stagePos, scale);
      expect(result).toEqual({ x: 50, y: 50 });
    });

    it('should handle zoom', () => {
      const pointer = { x: 100, y: 100 };
      const stagePos = { x: 0, y: 0 };
      const scale = 2; // Zoomed in 2x

      // 100 screen pixels = 50 canvas units
      const result = toCanvasCoords(pointer, stagePos, scale);
      expect(result).toEqual({ x: 50, y: 50 });
    });
  });

  describe('calculateZoom', () => {
    it('should zoom in correctly', () => {
      const currentScale = 1;
      const currentPos = { x: 0, y: 0 };
      const pointer = { x: 100, y: 100 };

      const result = calculateZoom(currentScale, currentPos, pointer, 1);

      expect(result.scale).toBeGreaterThan(1);
      // Position should shift to keep pointer stable
      expect(result.position.x).not.toBe(0);
      expect(result.position.y).not.toBe(0);
    });

    it('should zoom out correctly', () => {
      const currentScale = 1;
      const currentPos = { x: 0, y: 0 };
      const pointer = { x: 100, y: 100 };

      const result = calculateZoom(currentScale, currentPos, pointer, -1);

      expect(result.scale).toBeLessThan(1);
    });

    it('should respect max scale', () => {
      // Start at max scale
      const currentScale = MAX_SCALE;
      const currentPos = { x: 0, y: 0 };
      const pointer = { x: 0, y: 0 };

      const result = calculateZoom(currentScale, currentPos, pointer, 1);
      expect(result.scale).toBe(MAX_SCALE);
    });

    it('should respect min scale', () => {
      // Start at min scale
      const currentScale = MIN_SCALE;
      const currentPos = { x: 0, y: 0 };
      const pointer = { x: 0, y: 0 };

      const result = calculateZoom(currentScale, currentPos, pointer, -1);
      expect(result.scale).toBe(MIN_SCALE);
    });
  });
});
