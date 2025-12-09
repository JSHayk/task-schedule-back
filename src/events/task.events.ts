export class TaskCreatedEvent {
    constructor(
        public readonly taskId: number,
        public readonly userId: number,
        public readonly title: string
    ) { }
}

export class TaskUpdatedEvent {
    constructor(
        public readonly taskId: number,
        public readonly userId: number,
        public readonly title: string
    ) { }
}

export class TaskReassignedEvent {
    constructor(
        public readonly taskId: number,
        public readonly oldUserId: number,
        public readonly newUserId: number,
        public readonly title: string
    ) { }
}
