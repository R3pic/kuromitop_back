export class TrackDto {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly artist: string,
        public readonly thumbnail: string,
    ) {}
}