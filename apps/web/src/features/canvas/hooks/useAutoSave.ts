import { useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { saveStatusAtom, isSavingAtom } from '../stores/canvasAtoms';

interface UseAutoSaveOptions {
  data: unknown;
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ data, onSave, delay = 3000, enabled = true }: UseAutoSaveOptions) {
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const [, setIsSaving] = useAtom(isSavingAtom);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Refs to keep track of latest values for the cleanup function
  const onSaveRef = useRef(onSave);
  const dataRef = useRef(data);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    onSaveRef.current = onSave;
    dataRef.current = data;
    enabledRef.current = enabled;
  }, [onSave, data, enabled]);

  const save = useCallback(async () => {
    try {
      setSaveStatus('saving');
      setIsSaving(true);
      await onSaveRef.current();
      setSaveStatus('saved');
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [setSaveStatus, setIsSaving]);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // If we are unmounting and have pending data (enabled is true),
      // trigger an immediate save if possible.
      // Note: Since we're unmounting, we can't update state anymore,
      // but we can still fire the API call.
      if (enabledRef.current) {
        onSaveRef.current();
      }
    };
  }, [data, delay, enabled, save]);

  return {
    saveNow: save,
  };
}
