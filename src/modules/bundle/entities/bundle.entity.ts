import { UUID } from 'crypto';

export class Bundle {
    user_no: number;
    uuid: UUID;
    title: string;
    is_private: boolean;
}
