import { NFT } from '../types/nft';

export const nfts: NFT[] = [
  {
    id: 1,
    name: '頭金',
    description: '将棋の詰みのもっとも基本的な形です。王様の頭(上)に金を打つのでこの名前が付きました',
    imageUrl: './nfts/checkmate1.jpg',
  },
  {
    id: 2,
    name: '肩金',
    description: '王様の肩(斜め上)に金を打つのでこの名前が付きました',
    imageUrl: './nfts/checkmate2.jpg',
  },
  {
    id: 3,
    name: '腹金',
    description: '王様の腹(横)に金を打つのでこの名前が付きました。',
    imageUrl: './nfts/checkmate3.jpg',
  }
]; 