import { FnQueue, FN_QUEUE_EVENTS } from '../../src';


describe('FnQueue Abstract class', () => {

  /**
   * execute()
   */
  describe('execute()', () => {
    it('should do something', (done) => {
      class MyClass extends FnQueue {
        private val = 10;

        constructor() {
          super();
          // this.fnQueue.on(FN_QUEUE_EVENTS.FLUSHED, this.queueFlushed);
        }

        private queueFlushed() {
          console.log('Queue flushed: ' + this.val);
        }

        getVal() {
          return this.val;
        }

        private increaseVal() {
          setTimeout(() => {
            this.val++;
            this.fnQueue.next();
          }, 10);
        }

        increaseValXTimes(numberOftimes: number, cb: () => void) {
          for(let i = 0; i < numberOftimes; i++) {
            this.fnQueue.push(this.increaseVal);
          }
          this.fnQueue.once(FN_QUEUE_EVENTS.FLUSHED, cb);
          this.fnQueue.execute();
        }
      }
      let myClass = new MyClass();
      // myClass.increaseValXTimes(10);
      // setTimeout(() => {
      //   let val = myClass.getVal();
      //   expect(val).toEqual(20);
      //   done();
      // }, 500);
      

      myClass.increaseValXTimes(10, () => {
        let val = myClass.getVal();
        expect(val).toEqual(20);
        done();
      });
      

    });
  });

});




describe('FnQueueService', () => {

});