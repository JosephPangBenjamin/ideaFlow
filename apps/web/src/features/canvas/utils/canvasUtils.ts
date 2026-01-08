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

/**
 * 格式化更新时间：友好的相对时间显示
 * @param dateString 日期字符串
 * @returns 格式化后的时间描述
 */
export function formatUpdateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString('zh-CN');
}
