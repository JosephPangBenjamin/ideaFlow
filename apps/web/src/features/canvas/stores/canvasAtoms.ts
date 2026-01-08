import { atom } from 'jotai';
import { Canvas, CanvasNode, CanvasConnection } from '../services/canvas.service';

// Zoom constants moved to canvasUtils

// Current canvas being edited
export const currentCanvasAtom = atom<Canvas | null>(null);

// Nodes in current canvas
export const canvasNodesAtom = atom<CanvasNode[]>([]);

// Connections in current canvas
export const connectionsAtom = atom<CanvasConnection[]>([]);

// Saving state
export const isSavingAtom = atom<boolean>(false);
export const saveStatusAtom = atom<'idle' | 'saving' | 'saved' | 'error'>('idle');

// Selected node
export const selectedNodeIdAtom = atom<string | null>(null);

// Selected connection
export const selectedConnectionIdAtom = atom<string | null>(null);

// Canvas list
export const canvasListAtom = atom<Canvas[]>([]);
export const canvasListLoadingAtom = atom<boolean>(false);

// Zoom and pan state
export const scaleAtom = atom<number>(1);
export const positionAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

// Connection creation state
export const isConnectingAtom = atom<boolean>(false);
export const connectingFromNodeIdAtom = atom<string | null>(null);

// Interaction mode
export type InteractionMode = 'select' | 'create_region';
export const interactionModeAtom = atom<InteractionMode>('select');

// Derived atom: selected node object
export const selectedNodeAtom = atom((get) => {
  const selectedId = get(selectedNodeIdAtom);
  const nodes = get(canvasNodesAtom);
  return nodes.find((node) => node.id === selectedId) || null;
});

// Derived atom: selected connection object
export const selectedConnectionAtom = atom((get) => {
  const selectedId = get(selectedConnectionIdAtom);
  const connections = get(connectionsAtom);
  return connections.find((conn) => conn.id === selectedId) || null;
});

// Derived atom: scale percentage for display
export const scalePercentAtom = atom((get) => {
  const scale = get(scaleAtom);
  return Math.round(scale * 100);
});
