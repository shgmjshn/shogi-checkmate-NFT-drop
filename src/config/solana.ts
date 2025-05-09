import { Connection, clusterApiUrl } from '@solana/web3.js';

// Devnetのエンドポイント
export const SOLANA_NETWORK = 'devnet';

// テストで成功した安定したRPCエンドポイントを使用
export const SOLANA_RPC_HOST = 'https://api.devnet.solana.com';

// コネクションの作成（最適化された設定）
export const connection = new Connection(SOLANA_RPC_HOST, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 120000, // 120秒
  wsEndpoint: 'wss://api.devnet.solana.com',
  disableRetryOnRateLimit: false, // レート制限時の自動リトライを有効化
  httpHeaders: {
    'Content-Type': 'application/json',
  }
}); 