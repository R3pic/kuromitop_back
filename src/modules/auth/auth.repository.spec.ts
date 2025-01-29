import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { PostgresService } from '@common/database/postgres.service';
import { ConfigModule } from '@nestjs/config';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { RepositoryResult } from '@common/database/repository-result';
import { User } from '@user/entities/user.entity';
import { PoolClient } from 'pg';
import { configModuleOptions } from '@common/env/env.config';

describe('AuthRepository', () => {
    let repository: AuthRepository;
    let postgresService: PostgresService;
    let client: PoolClient;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(configModuleOptions)],
            providers: [
                AuthRepository, 
                PostgresService,
            ],
        }).compile();

        repository = module.get<AuthRepository>(AuthRepository);
        postgresService = module.get<PostgresService>(PostgresService);

        
        
    });

    beforeEach(async () => {
        client = await postgresService.getClient();
        await client.query('BEGIN');
        await client.query('SAVEPOINT test_savepoint');        
    });

    afterEach(async () => {
        await client.query('ROLLBACK TO SAVEPOINT test_savepoint');
    });

    describe('create', () => {
        describe('정상적인 데이터가 주어졌을 때', () => {
            it('새로운 유저를 데이터베이스에 생성한다.', async () => {
                const username = 'TestUser';
                const password = 'TestPassword';
                
                const authRegisterDto: AuthRegisterDto = {
                    username,
                    password,
                };

                const user = User.of(1, username);

                const expected = new RepositoryResult<User>(user, 3);
                jest
                    .spyOn(postgresService, 'getClient')
                    .mockResolvedValue(client);
                
                const actual = await repository.create(authRegisterDto);

                expect(actual).toEqual(expected);
            });
        });
    });
});
