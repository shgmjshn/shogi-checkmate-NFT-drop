import { runRPCTests } from '../utils/testRPCConnection';

// テストを実行
runRPCTests()
  .then(() => {
    console.log('\nテスト完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('テスト実行中にエラーが発生しました:', error);
    process.exit(1);
  }); 