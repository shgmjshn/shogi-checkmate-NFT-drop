import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { connection } from '../config/solana';
import { NFT } from '../types/nft';
import { WalletContextState } from '@solana/wallet-adapter-react';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2秒

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mintNFT = async (
  wallet: WalletContextState,
  nft: NFT
): Promise<string> => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      if (!wallet.publicKey) {
        throw new Error('ウォレットが接続されていません');
      }

      // ウォレットの接続状態を確認
      if (!wallet.connected) {
        try {
          await wallet.connect();
          await sleep(2000);
        } catch (error) {
          if (error instanceof Error && error.message.includes('ユーザーがリクエストを拒否しました')) {
            throw new Error('ウォレットの接続が拒否されました。NFTをミントするにはウォレットの接続が必要です。');
          }
          throw error;
        }
      }

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet));

      // NFTのメタデータを作成
      const { uri } = await metaplex
        .nfts()
        .uploadMetadata({
          name: nft.name,
          description: nft.description,
          image: nft.imageUrl,
        }, {
          commitment: 'confirmed'
        });

      // NFTをミント
      const { nft: mintedNFT } = await metaplex
        .nfts()
        .create({
          uri,
          name: nft.name,
          sellerFeeBasisPoints: 0,
          symbol: 'SHOGI',
          creators: [{ address: wallet.publicKey, share: 100 }],
        }, {
          commitment: 'confirmed'
        });

      return mintedNFT.address.toString();
    } catch (error) {
      console.error(`NFTのミント中にエラーが発生しました (試行 ${retries + 1}/${MAX_RETRIES}):`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('ブロックハッシュが無効')) {
          try {
            await wallet.disconnect();
            await sleep(2000);
            await wallet.connect();
            await sleep(2000);
          } catch (reconnectError) {
            console.error('ウォレットの再接続に失敗しました:', reconnectError);
          }
          
          retries++;
          await sleep(RETRY_DELAY * retries);
          continue;
        }
        
        if (error.message.includes('ウォレットの接続が拒否されました')) {
          throw error; // 接続拒否の場合は即座にエラーを投げる
        }
      }
      
      if (retries === MAX_RETRIES - 1) {
        throw new Error('NFTのミントに失敗しました。ネットワーク接続を確認してください。');
      }
      
      retries++;
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('予期せぬエラーが発生しました');
}; 