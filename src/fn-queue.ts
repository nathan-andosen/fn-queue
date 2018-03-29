

export const FN_QUEUE_EVENTS = {
  FLUSHED: 'flushed',
  ERROR: 'error'
};


/**
 * Queue async function in typescript class
 * 
 * TODO:
 * - Make sure there is a fail safe, if a function does not call the cb
 * - Ability to push functions to the queue but not execute straight away
 * - Ability to pass function and execute straight away
 * - Ability to use this class as a service
 * - Have this.next() as an option
 * - Add event listening
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

  constructor(scope?: any) {
    this.scope = (scope) ? scope : window;
  }

  push(fn: () => void) {
    if(fn) {
      this.queue.push(fn);
    }
  }


  execute(fn: () => void) {
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
      return;
    }
    let fn: Function = this.queue.shift();
    fn.apply(this.scope);
    this.fnExecuteTimeoutId = setTimeout(() => {
      this.next();
    }, this.maxFnExecuteTime);
  }


  kill() {}

}


export abstract class FnQueue {
  protected fnQueue: FnQueueService = null;
  
  constructor() {
    this.fnQueue = new FnQueueService(this);
  }
}