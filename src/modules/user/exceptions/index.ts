import { UserNotFoundException } from './user-not-found.error';
import { UsernameAlreadyExistsException } from './username-already-exists.error';

export class UserServiceException {
    static USER_NOT_FOUND = new UserNotFoundException();
    static USER_ALREADY_EXISTS = new UsernameAlreadyExistsException();
}