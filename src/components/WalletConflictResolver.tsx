'use client';

import { useEffect, useState } from 'react';

export function WalletConflictResolver() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const originalEthereum = window.ethereum;
    if (originalEthereum && !Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable) {
      try {
        Object.defineProperty(window, 'ethereum', {
          get: () => originalEthereum,
          configurable: true,
        });
      } catch (error) {
        console.warn('Ethereum wallet conflict resolution failed:', error);
      }
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return null;
} 