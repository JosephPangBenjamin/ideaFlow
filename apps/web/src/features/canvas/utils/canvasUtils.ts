// Constants for zoom limits
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 4;
export const SCALE_BY = 1.1;

export interface Point {
  x: number;
  y: number;
}

export interface ZoomState {
  scale: number;
  position: Point;
}

/**
 * Converts screen/pointer coordinates to canvas coordinates
 * @param pointerPos The position of the pointer on the screen (relative to stage container)
 * @param stagePos The current position (x,y) of the stage
 * @param scale The current scale of the stage
 * @returns Point in canvas coordinates
 */
export function toCanvasCoords(pointerPos: Point, stagePos: Point, scale: number): Point {
  return {
    x: (pointerPos.x - stagePos.x) / scale,
    y: (pointerPos.y - stagePos.y) / scale,
  };
}

/**
 * Calculates new scale and position for zooming centered on a pointer
 * @param currentScale Current stage scale
 * @param currentPos Current stage position
 * @param pointerPos Pointer position relative to stage container
 * @param direction Zoom direction (1 for zoom in, -1 for zoom out)
 * @returns New scale and position
 */
export function calculateZoom(
  currentScale: number,
  currentPos: Point,
  pointerPos: Point,
  direction: 1 | -1
): ZoomState {
  // Calculate mouse position relative to canvas (before zoom)
  const mousePointTo = toCanvasCoords(pointerPos, currentPos, currentScale);

  // Calculate new scale
  const newScaleRaw = direction > 0 ? currentScale * SCALE_BY : currentScale / SCALE_BY;

  // Clamp scale
  const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScaleRaw));

  // Calculate new position to keep mouse position stable
  // newPos = pointer - (mousePointInCanvas * newScale)
  const newPos = {
    x: pointerPos.x - mousePointTo.x * newScale,
    y: pointerPos.y - mousePointTo.y * newScale,
  };

  return {
    scale: newScale,
    position: newPos,
  };
}
