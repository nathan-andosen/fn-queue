export declare const FN_QUEUE_EVENTS: {
    FLUSHED: string;
    FUNCTION_TIMEOUT: string;
};
export interface iFnQueueOptions {
    maxFnExecuteTime?: number;
}
export declare class FnQueue {
    private queue;
    private processingQueue;
    private scope;
    private maxFnExecuteTime;
    private fnExecuteTimeoutId;
    private eventHandler;
    constructor(scope?: any, options?: iFnQueueOptions);
    isProcessing(): boolean;
    push(fn: (cb?: () => void) => void): void;
    execute(fn?: (cb?: () => void) => void): void;
    next(): void;
    private startMaxExecutionTimeout();
    kill(): void;
    on(eventName: string, fn: Function): void;
    once(eventName: string, fn: Function): void;
}
export declare abstract class FnQueueAbstract {
    protected fnQueue: FnQueue;
    constructor();
}
