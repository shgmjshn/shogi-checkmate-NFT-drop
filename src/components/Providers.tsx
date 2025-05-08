'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { WalletProviderWrapper } from './WalletProviderWrapper';
import { ErrorBoundary } from 'react-error-boundary';
import { WalletConflictResolver } from './WalletConflictResolver';
import { useEffect, useState } from 'react';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>エラーが発生しました</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WalletProviderWrapper>
        <ChakraProvider>
          <WalletConflictResolver />
          {children}
        </ChakraProvider>
      </WalletProviderWrapper>
    </ErrorBoundary>
  );
} 