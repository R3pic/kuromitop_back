import { DB, PostgresModule } from '@common/database/postgres.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { ClsModuleOptions } from 'nestjs-cls';

export const clsModuleOptions: ClsModuleOptions = {
  plugins: [
    new ClsPluginTransactional({
      imports: [PostgresModule],
      adapter: new TransactionalAdapterPgPromise({
        dbInstanceToken: DB,
      }),
    }),
  ],
};