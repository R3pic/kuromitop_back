import { InvalidLocalCredentialException } from './invaild-local-credential.error';
import { UsernameAlreadyExistsException } from './username-already-exists.error';

export class AuthServiceException {
    static INVAILD_LOGIN_CREDENTIAL = new InvalidLocalCredentialException();
    static USERNAME_ALREADY_EXISTS = new UsernameAlreadyExistsException();
}