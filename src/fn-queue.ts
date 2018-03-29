import { EventEmitter } from './event-emitter';

export const FN_QUEUE_EVENTS = {
  FLUSHED: 'flushed',
  ERROR: 'error'
};



/**
 * Queue async function in typescript class
 * 
 * TODO:
 * - (DONE) Make sure there is a fail safe, if a function does not call the cb
 * - (DONE) Ability to push functions to the queue but not execute straight away
 * - (DONE) Ability to pass function and execute straight away
 * - (DONE) Ability to use this class as a service
 * - (DONE) Have this.next() as an option
 * - (DONE) Add event listening
 * - Ability to kill processing of the queue
 * - Needs testing
 * 
 * @export
 * @abstract
 * @class FnQueue
 */
export class FnQueueService {
  private queue: any[] = [];
  private processingQueue: boolean = false;
  private scope: any;
  private maxFnExecuteTime: number = 1000 * 60; // 60 seconds
  private fnExecuteTimeoutId: number;
  private eventEmitter: EventEmitter;

  constructor(scope?: any, options?: any) {
    this.scope = (scope) ? scope : {};
    this.eventEmitter = new EventEmitter(this.scope);
    options = options || {};
    if(options.maxFnExecuteTime) {
      this.maxFnExecuteTime = options.maxFnExecuteTime;
    }
  }

  push(fn: () => void) {
    if(fn) {
      this.queue.push(fn);
    }
  }


  execute(fn?: () => void) {
    this.push(fn);
    if(!this.processingQueue) {
      this.next();
    }
  }



  next() {
    this.processingQueue = true;
    if(this.fnExecuteTimeoutId) { clearTimeout(this.fnExecuteTimeoutId); }
    if(this.queue.length < 1) {
      this.processingQueue = false;
      this.eventEmitter.emit(FN_QUEUE_EVENTS.FLUSHED);
      return;
    }
    let fn: Function = this.queue.shift();
    fn.apply(this.scope);
    this.fnExecuteTimeoutId = setTimeout(() => {
      this.eventEmitter.emit(FN_QUEUE_EVENTS.ERROR);
      this.next();
    }, this.maxFnExecuteTime);
  }


  kill() {}

  on(eventName: string, fn: Function) {
    this.eventEmitter.subscribe(eventName, fn);
  }

  once(eventName: string, fn: Function) {
    let onceFn = (data) => {
      fn.call(this.scope, data);
      this.eventEmitter.unsubscribe(eventName, onceFn);
    };
    this.eventEmitter.subscribe(eventName, onceFn);
  }
}


export abstract class FnQueue {
  protected fnQueue: FnQueueService = null;
  
  constructor() {
    this.fnQueue = new FnQueueService(this);
  }
}