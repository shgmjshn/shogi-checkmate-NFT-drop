'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Image,
  HStack,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { nfts } from '../data/nfts';
import { NFT } from '../types/nft';
import { mintNFT } from '../utils/mintNFT';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const toast = useToast();
  const wallet = useWallet();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (!wallet.connected) {
          toast({
            title: 'ウォレット接続が必要です',
            description: 'NFTをミントするにはウォレットを接続してください。',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('ウォレット接続エラー:', error);
        toast({
          title: 'ウォレット接続エラー',
          description: 'ウォレットの接続に問題が発生しました。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    checkWalletConnection();
  }, [wallet.connected, toast]);

  const handleMint = async () => {
    if (!wallet.publicKey) {
      toast({
        title: 'ウォレット接続が必要です',
        description: 'NFTをミントするにはウォレットを接続してください。',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!selectedNFT) {
      toast({
        title: 'NFTを選択してください',
        description: 'ミントするNFTを選択してください。',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const nftAddress = await mintNFT(wallet, selectedNFT);

      toast({
        title: 'ミント成功',
        description: `NFTのミントが完了しました！\nアドレス: ${nftAddress}`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
      console.error('ミントエラー:', error);
      toast({
        title: 'エラー',
        description: 'ミント処理中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'gray';
      case 'rare':
        return 'blue';
      case 'legendary':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <HStack w="full" justify="flex-end">
          <WalletMultiButton />
        </HStack>

        <Heading as="h1" size="2xl">
          将棋チェックメイト NFT ドロップ
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
          {nfts.map((nft) => (
            <Box
              key={nft.id}
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              bg="white"
              cursor="pointer"
              onClick={() => setSelectedNFT(nft)}
              border={selectedNFT?.id === nft.id ? '2px solid' : 'none'}
              borderColor="blue.500"
            >
              <VStack spacing={4}>
                <Image
                  src={nft.imageUrl}
                  alt={nft.name}
                  borderRadius="md"
                  fallbackSrc="https://via.placeholder.com/400"
                  maxH="300px"
                  objectFit="contain"
                />
                
                {/*<Badge colorScheme={getRarityColor(nft.rarity)}>
                  {nft.rarity.toUpperCase()}
                </Badge>*/}
                
                <Heading size="md">{nft.name}</Heading>
                
                <Text fontSize="sm" textAlign="center">
                  {nft.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleMint}
          isLoading={isLoading}
          loadingText="ミント中..."
          isDisabled={!wallet.publicKey || !selectedNFT}
        >
          NFTをミントする
        </Button>
      </VStack>
    </Container>
  );
} 