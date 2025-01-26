import { Expose } from 'class-transformer';

export class Profile {
    @Expose()
    user_no: number;
    @Expose()
    nickname: string | null;
    @Expose()
    thumbnail_url: string | null;
    @Expose()
    introduction: string | null;
    @Expose()
    email: string | null;
    @Expose()
    birthday: string | null;
    @Expose()
    auth_date: Date;
}