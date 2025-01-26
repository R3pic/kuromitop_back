import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PostgresModule } from '@/common/database/postgres.module';

describe('UserService', () => {
    let service: UserService;
    let repository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PostgresModule,
            ],
            providers: [
                UserService, 
                UserRepository,
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<UserRepository>(UserRepository);
    });

    describe('isExistByUsername', () => {
        it('이름이 존재한다면 true를 반환한다.', async () => {
            jest.spyOn(repository, 'isExistByUsername')
                .mockResolvedValue(true);
            const username = 'TestUser';
            
            const expected = true;

            const actual = await service.isExistByUsername(username);

            expect(actual).toEqual(expected);
        });

        it('이름이 존재하지 않는다면 false를 반환한다.', async () => {
            jest.spyOn(repository, 'isExistByUsername')
                .mockResolvedValue(false);
            const username = 'TestUser';
            
            const expected = false;

            const actual = await service.isExistByUsername(username);

            expect(actual).toEqual(expected);
        });
    });
    
});
