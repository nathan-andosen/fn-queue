export declare const FN_QUEUE_EVENTS: {
    FLUSHED: string;
    ERROR: string;
};
export declare class FnQueueService {
    private queue;
    private processingQueue;
    private scope;
    private maxFnExecuteTime;
    private fnExecuteTimeoutId;
    constructor(scope?: any);
    push(fn: () => void): void;
    execute(fn: () => void): void;
    next(): void;
    kill(): void;
}
export declare abstract class FnQueue {
    protected fnQueue: FnQueueService;
    constructor();
}
