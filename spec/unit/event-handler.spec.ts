import { EventHandler } from '../../src/event-handler';

/**
 * EventHandler
 */
describe('EventHandler', () => {

  it('should emit event', () => {
    let eventHandler = new EventHandler();
    let a = 10;
    let fnOne = () => {
      a = 20;
    };
    eventHandler.subscribe('test', fnOne);
    eventHandler.emit('test');
    expect(a).toEqual(20);
  });

  it('should subscribe and unsubscribe events', () => {
    let eventHandler = new EventHandler();
    let fnOne = () => {};
    eventHandler.subscribe('test', fnOne);
    expect(eventHandler['events']['test']).toBeDefined();
    expect(eventHandler['events']['test'].length).toEqual(1);
    eventHandler.unsubscribe('test', fnOne);
    expect(eventHandler['events']['test'].length).toEqual(0);
  });
  
  it('should subscribe and unsubscribe for function inside class', () => {
    class MyClass {
      private eventHandler: EventHandler;
      private valOne: number = 0;
      constructor() {
        this.eventHandler = new EventHandler(this);
      }

      private listenToValUpdate(data) {
        this.valOne = data;
      }

      subscribeTestEvent() {
        this.eventHandler.subscribe('valUpdate', this.listenToValUpdate);
      }

      unsubscribeTestEvent() {
        this.eventHandler.unsubscribe('valUpdate', this.listenToValUpdate);
      }

      setVal(val: number) {
        this.valOne = 0;
        this.eventHandler.emit('valUpdate', val);
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