export enum LoginType {
    JWT = 0,
    SPOTIFY = 1,
    GOOGLE = 2,
    DISCORD = 3,
}

export class User {
    user_no: number;
    username: string;
    login_type: LoginType;

    constructor(user_no: number, username: string, login_type: LoginType) {
        this.user_no = user_no;
        this.username = username;
        this.login_type = login_type;
    }

    static of(user_no: number, username: string, login_type: LoginType) {
        return new User(user_no, username, login_type);
    }
}
