import { useState } from 'react';
import type { SenderInfo } from '../types';

const STORAGE_KEY = 'postprint_sender';

function loadFromStorage(): SenderInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SenderInfo) : null;
  } catch {
    return null;
  }
}

export function useSenderStorage(): [SenderInfo | null, (info: SenderInfo) => void] {
  const [sender, setSender] = useState<SenderInfo | null>(loadFromStorage);

  const saveSender = (info: SenderInfo) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    setSender(info);
  };

  return [sender, saveSender];
}
