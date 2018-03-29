import { EventEmitter } from '../../src/event-emitter';

describe('EventEmitter', () => {

  it('should emit event', () => {
    let eventEmitter = new EventEmitter();
    let a = 10;
    let fnOne = () => {
      a = 20;
    };
    eventEmitter.subscribe('test', fnOne);
    eventEmitter.emit('test');
    expect(a).toEqual(20);
  });

  it('should subscribe and unsubscribe events', () => {
    let eventEmitter = new EventEmitter();
    let fnOne = () => {};
    eventEmitter.subscribe('test', fnOne);
    expect(eventEmitter['events']['test']).toBeDefined();
    expect(eventEmitter['events']['test'].length).toEqual(1);
    eventEmitter.unsubscribe('test', fnOne);
    expect(eventEmitter['events']['test'].length).toEqual(0);
  });
  

  it('should subscribe and unsubscribe for function inside class', () => {
    class MyClass {
      private eventEmitter: EventEmitter;
      private valOne: number = 0;
      constructor() {
        this.eventEmitter = new EventEmitter(this);
      }

      private listenToValUpdate(data) {
        this.valOne = data;
      }

      subscribeTestEvent() {
        this.eventEmitter.subscribe('valUpdate', this.listenToValUpdate);
      }

      unsubscribeTestEvent() {
        this.eventEmitter.unsubscribe('valUpdate', this.listenToValUpdate);
      }

      setVal(val: number) {
        this.valOne = 0;
        this.eventEmitter.emit('valUpdate', val);
      } 
    }

    let myClass = new MyClass();
    myClass.subscribeTestEvent();
    myClass.setVal(100);
    expect(myClass['valOne']).toEqual(100);
    myClass.unsubscribeTestEvent();
    myClass.setVal(200);
    expect(myClass['valOne']).toEqual(0);
  });
});