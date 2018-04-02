import { EventHandler } from './event-handler';

// events fired by the FnQueue Service
export const FN_QUEUE_EVENTS = {
  FLUSHED: 'flushed',
  FUNCTION_TIMEOUT: 'function-timeout'
};

export interface iFnQueueOptions {
  maxFnExecuteTime?: number;
}

/**
 * Queue service to execute async functions in a linear manner
 * 
 * @export
 * @class FnQueue
 */
export class FnQueue {
  private queue: any[] = [];
  private processingQueue: boolean = false;
  private scope: any;
  private maxFnExecuteTime: number = 1000 * 30; // 30 seconds
  private fnExecuteTimeoutId: number;
  private eventHandler: EventHandler;

  /**
   * Creates an instance of FnQueue.
   * @param {*} [scope] The scope "this" will apply to
   * @memberof FnQueue
   */
  constructor(scope?: any, options?: iFnQueueOptions) {
    this.scope = (scope) ? scope : {};
    this.eventHandler = new EventHandler(this.scope);
    options = options || {};
    if(options.maxFnExecuteTime) {
      this.maxFnExecuteTime = options.maxFnExecuteTime;
    }
  }

  /**
   * Determine if the queue is being processed
   * 
   * @returns {boolean} 
   * @memberof FnQueue
   */
  isProcessing(): boolean {
    return this.processingQueue;
  }

  /**
   * Push a function to the queue but do not execute it
   * 
   * @param {Function} fn 
   * @memberof FnQueue
   */
  push(fn: (cb?: () => void) => void) {
    if(fn) {
      this.queue.push(fn);
    }
  }

  /**
   * Push a function to the queue and execute it as well
   * 
   * @param {Function} [fn] 
   * @memberof FnQueue
   */
  execute(fn?: (cb?: () => void) => void) {
    this.push(fn);
    if(!this.processingQueue) {
      this.next();
    }
  }

  /**
   * Process the next function in the queue
   * 
   * @memberof FnQueue
   */
  next() {
    this.processingQueue = true;
    if(this.fnExecuteTimeoutId) { 
      clearTimeout(this.fnExecuteTimeoutId); 
    }
    if(this.queue.length < 1) {
      this.processingQueue = false;
      this.eventHandler.emit(FN_QUEUE_EVENTS.FLUSHED);
      return;
    }
    this.startMaxExecutionTimeout();
    let fn: Function = this.queue.shift();
    let self = this;
    fn.apply(this.scope, [() => {
      self.next();
    }]);
  }

  /**
   * Start the timeout that will fire if the async function in the queue
   * does not fire the next function
   * 
   * @memberof FnQueue
   */
  private startMaxExecutionTimeout() {
    this.fnExecuteTimeoutId = setTimeout(() => {
      this.eventHandler.emit(FN_QUEUE_EVENTS.FUNCTION_TIMEOUT);
      this.next();
    }, this.maxFnExecuteTime);
  }

  /**
   * Kill processing of the queue and empty the queue
   * 
   * @memberof FnQueue
   */
  kill() {
    this.queue = [];
  }

  /**
   * Listen to events
   * 
   * @param {string} eventName 
   * @param {Function} fn 
   * @memberof FnQueue
   */
  on(eventName: string, fn: Function) {
    this.eventHandler.subscribe(eventName, fn);
  }

  /**
   * Listen to an event only once
   * 
   * @param {stirng} eventName 
   * @param {Function} fn 
   * @memberof FnQueue
   */
  once(eventName: string, fn: Function) {
    let onceFn = (data) => {
      fn.call(this.scope, data);
      this.eventHandler.unsubscribe(eventName, onceFn);
    };
    this.eventHandler.subscribe(eventName, onceFn);
  }
}


/**
 * An abstract class that can be extend to add the ability to queue
 * async functions 
 * 
 * @export
 * @abstract
 * @class FnQueue
 */
export abstract class FnQueueAbstract {
  protected fnQueue: FnQueue = null;
  
  constructor() {
    this.fnQueue = new FnQueue(this);
  }
}