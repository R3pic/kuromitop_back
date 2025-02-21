import { UserNotFoundException } from '@user/user.errors';
import { ServiceExceptionFilter } from './service-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

type MockArgumentHost = Pick<ArgumentsHost, 'switchToHttp'>;

describe('ServiceExceptionFilter', () => {
  let filter: ServiceExceptionFilter;

  beforeAll(() => {
    filter = new ServiceExceptionFilter();
  });

  describe('ServiceException 발생 시 ', () => {
    it('올바른 형태의 Error Response를 전달한다.', () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();

      const mockResponse = {
        status: mockStatus,
        json: mockJson,
      };

      const mockHost: MockArgumentHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
      };

      const expected = {
        error: 'Not Found',
        message: '존재하지 않는 유저입니다.',
        statusCode: 404,
      };

      filter.catch(new UserNotFoundException(), mockHost as ArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(expected);
    });
  });
});
