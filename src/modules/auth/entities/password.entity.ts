export class Password {
    user_no: number;
    password: string;
    update_at: Date;

    constructor(user_no: number, password: string, update_at: Date) {
        this.user_no = user_no;
        this.password = password;
        this.update_at = update_at;
    }
}