export class CommentDto {
    constructor(
        public readonly id: number,
        public readonly content: string,
        public readonly created_at: Date,
    ) {

    }
}