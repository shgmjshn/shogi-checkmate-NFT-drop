import { Connection, clusterApiUrl } from '@solana/web3.js';

// Devnetのエンドポイント
export const SOLANA_NETWORK = 'devnet';

// より安定したRPCエンドポイントを使用
export const SOLANA_RPC_HOST = 'https://api.devnet.solana.com';

// コネクションの作成（タイムアウトと再試行の設定を追加）
export const connection = new Connection(SOLANA_RPC_HOST, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60秒
  wsEndpoint: 'wss://api.devnet.solana.com',
}); 