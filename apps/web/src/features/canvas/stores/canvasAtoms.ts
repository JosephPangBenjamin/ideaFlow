import { atom } from 'jotai';
import { Canvas, CanvasNode } from '../services/canvas.service';

// Zoom constants moved to canvasUtils

// Current canvas being edited
export const currentCanvasAtom = atom<Canvas | null>(null);

// Nodes in the current canvas
export const canvasNodesAtom = atom<CanvasNode[]>([]);

// Saving state
export const isSavingAtom = atom<boolean>(false);
export const saveStatusAtom = atom<'idle' | 'saving' | 'saved' | 'error'>('idle');

// Selected node
export const selectedNodeIdAtom = atom<string | null>(null);

// Canvas list
export const canvasListAtom = atom<Canvas[]>([]);
export const canvasListLoadingAtom = atom<boolean>(false);

// Zoom and pan state
export const scaleAtom = atom<number>(1);
export const positionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

// Derived atom: selected node object
export const selectedNodeAtom = atom((get) => {
  const selectedId = get(selectedNodeIdAtom);
  const nodes = get(canvasNodesAtom);
  return nodes.find((node) => node.id === selectedId) || null;
});

// Derived atom: scale percentage for display
export const scalePercentAtom = atom((get) => {
  const scale = get(scaleAtom);
  return Math.round(scale * 100);
});
