/**
 * Class to emit events
 * 
 * @export
 * @class EventEmitter
 */
export class EventEmitter {
  private events: any;
  private scope: any;


  /**
   * Creates an instance of EventEmitter.
   * @param {*} [scope] The scope "this" will apply to
   * @memberof EventEmitter
   */
  constructor(scope?: any) {
    this.events = {};
    this.scope = (scope) ? scope : null;
  }


  /**
   * Generate a id
   * 
   * @private
   * @returns {string} 
   * @memberof EventEmitter
   */
  private generateId(): string {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
      .toUpperCase()
  }


  /**
   * Emit an event
   * 
   * @param {string} eventName 
   * @param {*} data 
   * @memberof EventEmitter
   */
  emit(eventName: string, data?: any) {
    const events = this.events[eventName];
    if(events) {
      for(let i = 0; i < events.length; i++) {
        events[i].call(this.scope, data);
      }
    }
  }


  /**
   * Subscribe to an event
   * 
   * @param {string} eventName 
   * @param {Function} fn 
   * @memberof EventEmitter
   */
  subscribe(eventName: string, fn: Function) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }
    fn['subscribeId'] = this.generateId();
    this.events[eventName].push(fn);
  }


  /**
   * Unsubscribe to an event
   * 
   * @param {string} eventName 
   * @param {Function} fn 
   * @memberof EventEmitter
   */
  unsubscribe(eventName: string, fn: Function) {
    if(!fn['subscribeId']) { return; }
    if(this.events[eventName]) {
      for(let i = 0; i < this.events[eventName].length; i++) {
        if(this.events[eventName][i]['subscribeId'] === fn['subscribeId']) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}