import { atom } from 'jotai';
import { Idea } from '../types';

export const ideasAtom = atom<Idea[]>([]);

// Atom to control QuickCapture visibility - technically global UI state, but belongs to ideas feature
export const quickCaptureOpenAtom = atom(false);
