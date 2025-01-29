export enum LoginType {
    JWT = 0,
    SPOTIFY = 1,
    GOOGLE = 2,
    DISCORD = 3,
}

export class User {
    user_no: number;
    username: string;
    // login_type: LoginType;

    constructor(user_no: number, username: string) {
        this.user_no = user_no;
        this.username = username;
    }

    static of(user_no: number, username: string) {
        return new User(user_no, username);
    }
}
