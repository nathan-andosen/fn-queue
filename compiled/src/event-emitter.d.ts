export declare class EventEmitter {
    private events;
    private scope;
    constructor(scope?: any);
    private generateId();
    emit(eventName: string, data?: any): void;
    subscribe(eventName: string, fn: Function): void;
    unsubscribe(eventName: string, fn: Function): void;
}
