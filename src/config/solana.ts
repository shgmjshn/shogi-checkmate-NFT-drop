import { Connection, clusterApiUrl } from '@solana/web3.js';

// Devnetのエンドポイント
export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_HOST = clusterApiUrl(SOLANA_NETWORK);

// コネクションの作成
export const connection = new Connection(SOLANA_RPC_HOST, 'confirmed'); 