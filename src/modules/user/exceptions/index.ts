import { UserNotFoundException } from './user-not-found.error';

export class UserServiceException {
    static USER_NOT_FOUND = new UserNotFoundException();
}