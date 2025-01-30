import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { getMockTransactionHost } from '@test/mockTransactionHost';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoginType, User } from './entities/user.entity';
import { DatabaseError } from 'pg';
import { PostgresError } from 'pg-error-enum';
import { UserNotFoundException } from './exceptions/user-not-found.error';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.error';
import { Profile } from './entities/profile.entity';
import { AnonymousProfile } from './dto/anonymous-profile.dto';

describe('UserService', () => {
    let service: UserService;
    let mockRepository: MockProxy<UserRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService, 
                UserRepository,
                {
                    provide: TransactionHost,
                    useValue: getMockTransactionHost(),
                },
            ],
        })
            .overrideProvider(UserRepository)
            .useValue(mock<UserRepository>())
            .compile();

        service = module.get(UserService);
        mockRepository = module.get(UserRepository);
    });

    describe('create', () => {
        it('새로운 사용자를 생성해야 한다.', async () => {
            const user_no = 1;
            const username = 'TestUser';
            const login_type = LoginType.JWT;

            const expected = User.of(user_no, username, login_type);

            mockRepository.create.mockResolvedValue(expected);

            const actual = await service.create(username);

            expect(actual).toEqual(expected);
        });

        it('중복된 사용자명을 생성할 경우 USER_ALREADY_EXISTS를 발생시켜야 한다.', async () => {
            const username = 'TestUser';

            const Exception = new DatabaseError('', 0, 'error');
            Exception.code = PostgresError.UNIQUE_VIOLATION;

            const expected = UsernameAlreadyExistsException;

            mockRepository.create.mockRejectedValue(Exception);

            const method = async () => await service.create(username);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('findByNo', () => {
        it('사용자가 존재할 경우 User를 반환해야 한다.', async () => {
            const userNo = 1;

            const user = User.of(userNo, 'User', LoginType.JWT);
            const expected = user;

            mockRepository.findByNo.mockResolvedValue(user);

            const actual = await service.findByNo(userNo);

            expect(actual).toEqual(expected);
        });

        it('사용자가 존재하지 않을 경우 UserNotFoundException을 발생시켜야 한다.', async () => {
            const userNo = 1;

            const expected = UserNotFoundException;

            mockRepository.findByNo.mockResolvedValue(null);

            const method = async () => await service.findByNo(userNo);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('isExistByUsername', () => {
        it('주어진 사용자명이 존재할 경우 true를 반환해야 한다.', async () => {
            const username = 'TestUser';
            
            const expected = true;

            mockRepository.isExistByUsername.mockResolvedValue(true);

            const actual = await service.isExistByUsername(username);

            expect(actual).toEqual(expected);
        });

        it('주어진 사용자명이 존재하지 않을 경우 false를 반환한다.', async () => {
            const username = 'TestUser';
            
            const expected = false;

            mockRepository.isExistByUsername.mockResolvedValue(false);

            const actual = await service.isExistByUsername(username);

            expect(actual).toEqual(expected);
        });
    });
    
    describe('findByUsername', () => {
        it('주어진 사용자명이 존재할 경우 User를 반환해야 한다.', async () => {
            const userName = 'User';

            const user = User.of(1, 'User', LoginType.JWT);
            const expected = user;

            mockRepository.findUserByUsername.mockResolvedValue(user);

            const actual = await service.findByUsername(userName);

            expect(actual).toEqual(expected);
        });

        it('주어진 사용자명이 존재하지 않을 경우 UserNotFoundException을 발생시킨다.', async () => {
            const userName = 'User';

            const expected = UserNotFoundException;

            mockRepository.findByNo.mockResolvedValue(null);

            const method = async () => await service.findByUsername(userName);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('findProfileByUsername', () => {
        it('목표 사용자와 요청 사용자가 동일할 경우 자세한 프로필을 반환한다.', async () => {
            const userName = 'User';

            const requestUser = User.of(1, userName, LoginType.JWT);
            const profile: Profile = {
                user_no: 1,
                nickname: null,
                thumbnail_url: null,
                introduction: null,
                email: null,
                birthday: null,
                auth_date: new Date(),
            };
            const expected = profile;

            mockRepository.findProfileByUsername.mockResolvedValue(profile);

            const actual = await service.findProfileByUsername(userName, requestUser);

            expect(actual).toEqual(expected);
        });

        it('목표 사용자와 요청 사용자가 다를 경우 간단한 프로필을 반환한다.', async () => {
            const userName = 'User';

            const requestUser = User.of(1, userName, LoginType.JWT);
            const profile: Profile = {
                user_no: 2,
                nickname: null,
                thumbnail_url: null,
                introduction: null,
                email: null,
                birthday: null,
                auth_date: new Date(),
            };
            const expected = AnonymousProfile.of(profile);

            mockRepository.findProfileByUsername.mockResolvedValue(profile);

            const actual = await service.findProfileByUsername(userName, requestUser);

            expect(actual).toEqual(expected);
        });

        it('목표 사용자가 존재하고, 요청 사용자가 존재하지 않을 경우 간단한 프로필을 반환한다.', async () => {
            const userName = 'User';

            const profile: Profile = {
                user_no: 1,
                nickname: null,
                thumbnail_url: null,
                introduction: null,
                email: null,
                birthday: null,
                auth_date: new Date(),
            };
            const expected = AnonymousProfile.of(profile);

            mockRepository.findProfileByUsername.mockResolvedValue(profile);

            const actual = await service.findProfileByUsername(userName, null);

            expect(actual).toEqual(expected);
        });

        it('목표 사용자가 존재하지 않을 경우 UserNotFoundException을 발생시킨다.', async () => {
            const userName = 'User';

            const expected = UserNotFoundException;

            mockRepository.findProfileByUsername.mockResolvedValue(null);

            const method = async () => await service.findByUsername(userName);

            await expect(method()).rejects.toThrow(expected);
        });
    });
});
