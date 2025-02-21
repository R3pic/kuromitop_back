import { TransactionHost } from '@nestjs-cls/transactional';
import { MockProxy, mock } from 'jest-mock-extended';

export function getMockTransactionHost() {
  const tMock: MockProxy<TransactionHost> = mock<TransactionHost>();
  tMock.withTransaction.mockImplementation(
    async <R>(...args: unknown[]): Promise<R> => {
      const callback = args[args.length - 1] as (...cbArgs: any[]) => Promise<R>;
      return callback();
    }
  );
    
  return tMock; 
}