import { InvalidLocalCredentialException } from './invaild-local-credential.error';

export class AuthServiceException {
    static INVAILD_LOGIN_CREDENTIAL = new InvalidLocalCredentialException();
}