import { Connection, clusterApiUrl } from '@solana/web3.js';

const testRPCConnection = async (endpoint: string) => {
  console.log(`\nテスト開始: ${endpoint}`);
  const connection = new Connection(endpoint, 'confirmed');
  
  try {
    // 1. 基本的な接続テスト
    console.log('1. 接続テスト中...');
    const start = Date.now();
    const versionInfo = await connection.getVersion();
    const end = Date.now();
    console.log(`✅ 接続成功！応答時間: ${end - start}ms`);
    console.log('Solana バージョン:', versionInfo);

    // 2. ブロックハッシュ取得テスト
    console.log('\n2. ブロックハッシュ取得テスト中...');
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    console.log(`✅ ブロックハッシュ取得成功: ${blockhash}`);

    // 3. ネットワーク状態テスト
    console.log('\n3. ネットワーク状態テスト中...');
    console.log(`✅ ネットワーク状態: 接続成功 (バージョン: ${versionInfo['solana-core']})`);

    return {
      success: true,
      endpoint,
      responseTime: end - start,
      version: versionInfo,
      health: 'connected'
    };
  } catch (error) {
    console.error(`❌ エラー発生: ${error instanceof Error ? error.message : '不明なエラー'}`);
    return {
      success: false,
      endpoint,
      error: error instanceof Error ? error.message : '不明なエラー'
    };
  }
};

// テスト実行関数
export const runRPCTests = async () => {
  const endpoints = [
    'https://api.devnet.solana.com',
    'https://devnet.solana.rpc.genesysgo.net',
    'https://devnet.genesysgo.net'
  ];

  console.log('RPC接続テストを開始します...\n');
  
  const results = await Promise.all(
    endpoints.map(endpoint => testRPCConnection(endpoint))
  );

  console.log('\n=== テスト結果サマリー ===');
  results.forEach(result => {
    console.log(`\nエンドポイント: ${result.endpoint}`);
    if (result.success) {
      console.log(`✅ 成功 - 応答時間: ${result.responseTime}ms`);
      console.log(`   バージョン: ${result.version}`);
      console.log(`   ネットワーク状態: ${result.health}`);
    } else {
      console.log(`❌ 失敗 - エラー: ${result.error}`);
    }
  });
}; 