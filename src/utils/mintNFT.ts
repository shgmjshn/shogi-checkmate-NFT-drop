import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { connection } from '../config/solana';
import { NFT } from '../types/nft';
import { WalletContextState } from '@solana/wallet-adapter-react';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

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

      const metaplex = new Metaplex(connection)
        .use(walletAdapterIdentity(wallet));

      // NFTのメタデータを作成
      const { uri } = await metaplex
        .nfts()
        .uploadMetadata({
          name: nft.name,
          description: nft.description,
          image: nft.imageUrl,
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
          commitment: 'finalized',
        });

      return mintedNFT.address.toString();
    } catch (error) {
      console.error(`NFTのミント中にエラーが発生しました (試行 ${retries + 1}/${MAX_RETRIES}):`, error);
      
      if (retries === MAX_RETRIES - 1) {
        throw new Error('NFTのミントに失敗しました。ネットワーク接続を確認してください。');
      }
      
      retries++;
      await sleep(RETRY_DELAY * retries);
    }
  }
  
  throw new Error('予期せぬエラーが発生しました');
}; 