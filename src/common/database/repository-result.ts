export class ExistsResult {
    constructor(
        public exists: boolean
    ) {}
};

export class IsOwnerResult {
    constructor(
        public is_owner: boolean
    ) {}
};

export class RepositoryResult<T = unknown> {
    constructor(
        public result: T,
        public rowCount: number
    ) {}
};