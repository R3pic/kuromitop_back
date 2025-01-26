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
}
