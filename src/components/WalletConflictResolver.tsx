'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    _ethereum?: any;
    ethereum?: any;
    _solana?: any;
    solana?: any;
  }
}

export function WalletConflictResolver() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleWalletConflict = () => {
      try {
        // Ethereumの処理
        if (window.ethereum && !window._ethereum) {
          window._ethereum = window.ethereum;
        }

        // Solanaの処理
        if (window.solana && !window._solana) {
          window._solana = window.solana;
        }
      } catch (error) {
        console.warn('ウォレットの競合解決に失敗しました:', error);
      }
    };

    // 初期処理
    handleWalletConflict();

    // 定期的なチェック
    const checkInterval = setInterval(handleWalletConflict, 1000);

    // 5秒後にインターバルをクリア
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return null;
} 