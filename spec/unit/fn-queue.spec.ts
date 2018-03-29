import { FnQueue } from '../../src';


describe('FnQueue Abstract class', () => {

  /**
   * execute()
   */
  describe('execute()', () => {
    it('should do something', (done) => {
      class MyClass extends FnQueue {
        private val = 10;

        getVal() {
          return this.val;
        }

        private increaseVal() {
          setTimeout(() => {
            this.val++;
            this.fnQueue.next();
          }, 10);
        }

        increaseValXTimes(numberOftimes: number) {
          for(let i = 0; i < numberOftimes; i++) {
            this.fnQueue.execute(this.increaseVal);
          }
        }
      }
      let myClass = new MyClass();
      myClass.increaseValXTimes(10);
      setTimeout(() => {
        let val = myClass.getVal();
        expect(val).toEqual(20);
        done();
      }, 500);
      // expect(myClass.execute()).toEqual(10);

      // let fn = () => {};
      // myClass.fnQueue.push(fn);
      // 

    });
  });

});




describe('FnQueueService', () => {
  
});