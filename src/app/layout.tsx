import { Inter } from 'next/font/google';
import { Providers } from '../components/Providers';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '将棋チェックメイト NFT ドロップ',
  description: '将棋の詰みの形をNFTとしてミントできるアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 