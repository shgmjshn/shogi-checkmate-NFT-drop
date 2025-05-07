'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { WalletProviderWrapper } from '../components/WalletProviderWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <WalletProviderWrapper>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </WalletProviderWrapper>
      </body>
    </html>
  );
} 