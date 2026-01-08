import { useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { saveStatusAtom, isSavingAtom } from '../stores/canvasAtoms';

interface UseAutoSaveOptions {
  data: unknown;
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
  onlyOnUnmount?: boolean;
}

export function useAutoSave({
  data,
  onSave,
  delay = 3000,
  enabled = true,
  onlyOnUnmount = false,
}: UseAutoSaveOptions) {
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const [, setIsSaving] = useAtom(isSavingAtom);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const hasPendingChanges = useRef(false);

  // Refs to keep track of latest values for the cleanup function
  const onSaveRef = useRef(onSave);
  const dataRef = useRef(data);
  const enabledRef = useRef(enabled);
  const onlyOnUnmountRef = useRef(onlyOnUnmount);

  useEffect(() => {
    onSaveRef.current = onSave;
    dataRef.current = data;
    enabledRef.current = enabled;
    onlyOnUnmountRef.current = onlyOnUnmount;
  }, [onSave, data, enabled, onlyOnUnmount]);

  const save = useCallback(async () => {
    try {
      setSaveStatus('saving');
      setIsSaving(true);
      await onSaveRef.current();
      hasPendingChanges.current = false;
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

    // Track that we have something to save
    hasPendingChanges.current = true;

    if (!enabled || onlyOnUnmount) return;

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
    };
  }, [data, delay, enabled, onlyOnUnmount, save]);

  // Final cleanup save
  useEffect(() => {
    return () => {
      // If we are unmounting and have pending data, trigger an immediate save.
      if (enabledRef.current && hasPendingChanges.current) {
        onSaveRef.current();
      }
    };
  }, []);

  return {
    saveNow: save,
  };
}
