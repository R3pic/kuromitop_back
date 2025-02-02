import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserService } from '@user/user.service';
import { UserServiceException } from '@user/user.error';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '@common/utils/crypt';
import { TransactionHost } from '@nestjs-cls/transactional';
import { getMockTransactionHost } from '@test/mockTransactionHost';
import { User } from '@user/domain/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Password } from './entities/password.entity';
import { AuthServiceException } from './auth.error';
 
describe('AuthService', () => {
    let service: AuthService;
    let mockRepository: MockProxy<AuthRepository>;
    let mockUserService: MockProxy<UserService>;
    let mockJwtService: MockProxy<JwtService>;
    let mockCryptService: MockProxy<CryptService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AuthService,
                AuthRepository,
                UserService,
                JwtService,
                CryptService,
                {
                    provide: TransactionHost,
                    useValue: getMockTransactionHost(),
                },
            ],
        })
            .overrideProvider(AuthRepository)
            .useValue(mock<AuthRepository>())
            .overrideProvider(UserService)
            .useValue(mock<UserService>())
            .overrideProvider(JwtService)
            .useValue(mock<JwtService>())
            .overrideProvider(CryptService)
            .useValue(mock<CryptService>())
            .compile();

        service = module.get<AuthService>(AuthService);
        mockUserService = module.get(UserService);
        mockRepository = module.get(AuthRepository);
        mockJwtService = module.get(JwtService);
        mockCryptService = module.get(CryptService);
    });

    describe('register', () => {
        it('새로운 유저 계정을 생성한다.', async () => {
            const authRegisterDto: RegisterDto = {
                username: 'TestUser',
                password: 'testPassword',
            };

            const expected = true;
            const user = User.of(1, 'TestUser', 0);

            mockUserService.create.mockResolvedValue(user);

            const actual = await service.register(authRegisterDto);

            expect(actual).toBe(expected);
            expect(mockCryptService.hashPassword).toHaveBeenCalledWith(authRegisterDto.password);
            expect(mockUserService.create).toHaveBeenCalledWith(authRegisterDto.username);
        });

        it('이미 존재하는 아이디라면 UserAlreadyException을 발생시킨다.', async () => {
            const authRegisterDto: RegisterDto = {
                username: 'UserA',
                password: 'testPassword',
            };

            const Exception = UserServiceException.USER_ALREADY_EXISTS;

            const expected = Exception;

            mockUserService.create.mockRejectedValue(Exception);
            const createSpy = jest.spyOn(mockRepository, 'createPassword');

            const method = async () => await service.register(authRegisterDto);

            await expect(method()).rejects.toThrow(expected);
            expect(createSpy).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('로그인에 성공하면 jwt 토큰을 반환한다.', async () => {
            const user = User.of(1, 'Testuser', 0);

            const expected = 'accessToken';

            mockJwtService.signAsync.mockResolvedValue(expected);

            const actual = await service.login(user);

            expect(actual).toBe(expected);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                user_no: user.user_no,
                username: user.username,
            });
        });
    });

    describe('validateLogin', () => {
        it('로그인에 성공하면 user_no와 username을 반환한다.', async () => {
            const user_no = 1;
            const username = 'user';
            const password = 'password';

            const passwordEntity = new Password(user_no, password, new Date());

            const authUsernameLoginDto: LoginDto = {
                username,
                password,
            };

            const expected = {
                user_no,
                username,
            };

            mockRepository.findPasswordByUsername.mockResolvedValue(passwordEntity);
            mockCryptService.comparePassword.mockImplementation(async (h, p) => h === p);

            const actual = await service.validateUser(authUsernameLoginDto);

            expect(actual).toEqual(expected);
        });

        it('아이디가 존재하지 않는 경우 INVALID_LOGIN_CREDENTIAL을 발생시킨다다.', async () => {
            const username = 'user';
            const password = 'password';

            const authUsernameLoginDto: LoginDto = {
                username,
                password,
            };

            const expected = AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

            mockRepository.findPasswordByUsername.mockImplementation(async () => null);

            const method = async () => await service.validateUser(authUsernameLoginDto);

            await expect(method()).rejects.toThrow(expected);
        });

        it('비밀번호가 다른 경우 INVALID_LOGIN_CREDENTIAL을 발생시킨다다.', async () => {
            const user_no = 1;
            const username = 'user';
            const password = 'password';

            const authUsernameLoginDto: LoginDto = {
                username,
                password,
            };

            const passwordEntity = new Password(user_no, 'pass', new Date());

            const expected = AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

            mockRepository.findPasswordByUsername.mockResolvedValue(passwordEntity);
            mockCryptService.comparePassword.mockImplementation(async (h, p) => h === p);

            const method = async () => await service.validateUser(authUsernameLoginDto);

            await expect(method()).rejects.toThrow(expected);
        });
    });
});
