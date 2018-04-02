import { 
  FnQueue,
  FnQueueAbstract, 
  FN_QUEUE_EVENTS
} from '../../src';

/**
 * FnQueue()
 */
describe('FnQueue', () => {
  /**
   * isProcessing()
   */
  describe('isProcessing()', () => {
    it('should return the value if the queue is being processed', () => {
      let fnQueueSrv = new FnQueue();
      expect(fnQueueSrv.isProcessing()).toEqual(false);
      fnQueueSrv['processingQueue'] = true;
      expect(fnQueueSrv.isProcessing()).toEqual(true);
    });
  });

  /**
   * push()
   */
  describe('push()', () => {
    it('should push functions to the queue, but not execute them', () => {
      let fnQueueSrv = new FnQueue();
      let fnOne = () => {};
      let fnTwo = () => {};
      fnQueueSrv.push(fnOne);
      fnQueueSrv.push(fnTwo);
      expect(fnQueueSrv['queue'].length).toEqual(2);
      expect(fnQueueSrv.isProcessing()).toEqual(false);
    });
  });

  /**
   * execute() & next()
   */
  describe('execute() & next()', () => {
    it('should push function to queue and execute', (done) => {
      let val = 10;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        expect(val).toEqual(11);
        done();
      });
      let fnOne = () => {
        val++;
        fnQueueSrv.next(); 
      };
      fnQueueSrv.execute(fnOne);
    });

    it('should execute after other functions in queue', (done) => {
      let val = 10;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        expect(val).toEqual(15);
        done();
      });
      let fnOne = (cb) => {
        val = 20;
        cb();
      };
      let fnTwo = (cb) => {
        val = 15;
        cb();
      };
      fnQueueSrv.push(fnOne);
      fnQueueSrv.execute(fnTwo);
    });

    it('should execute and use callback function', (done) => {
      let val = 10;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        expect(val).toEqual(11);
        done();
      });
      let fnOne = (cb) => {
        val++;
        cb();
      };
      fnQueueSrv.execute(fnOne);
    });

    it('should flush queue even know function does not fire callback', (done) => {
      let val = 10;
      let fnTimeoutCalled = false;
      let fnQueueSrv = new FnQueue(null, { maxFnExecuteTime: 100 });
      fnQueueSrv.once(FN_QUEUE_EVENTS.FUNCTION_TIMEOUT, () => {
        fnTimeoutCalled = true;
      });
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        expect(val).toEqual(12);
        expect(fnTimeoutCalled).toEqual(true);
        done();
      });
      let fnOne = (cb) => {
        val++;
        // some error happens and callback is never fired...
      };
      let fnTwo = (cb) => {
        setTimeout(() => {
          val++;
          cb();
        }, 10);
      };
      fnQueueSrv.push(fnOne);
      fnQueueSrv.execute(fnTwo);
    });
  });

  /**
   * kill()
   */
  describe('kill()', () => {
    it('should kill the processing and empty the queue', (done) => {
      let val = 10;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        expect(val).toEqual(11);
        done();
      });
      let fnOne = (cb) => {
        setTimeout(() => {
          val++;
          cb();
        }, 100);
      };
      let fnTwo = (cb) => {
        setTimeout(() => {
          val++;
          cb();
        }, 100);
      };
      fnQueueSrv.push(fnOne);
      fnQueueSrv.execute(fnTwo);
      setTimeout(() => {
        fnQueueSrv.kill();
      }, 50);
    });
  });

  /**
   * on()
   */
  describe('on()', () => {
    it('should listen to events fired', () => {
      let val = 0;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.on(FN_QUEUE_EVENTS.FLUSHED, () => {
        val++;
      });
      fnQueueSrv['eventHandler'].emit(FN_QUEUE_EVENTS.FLUSHED);
      fnQueueSrv['eventHandler'].emit(FN_QUEUE_EVENTS.FLUSHED);
      expect(val).toEqual(2);
    });
  });

  /**
   * once()
   */
  describe('once()', () => {
    it('should listen to event only once', () => {
      let val = 0;
      let fnQueueSrv = new FnQueue();
      fnQueueSrv.once(FN_QUEUE_EVENTS.FLUSHED, () => {
        val++;
      });
      fnQueueSrv['eventHandler'].emit(FN_QUEUE_EVENTS.FLUSHED);
      fnQueueSrv['eventHandler'].emit(FN_QUEUE_EVENTS.FLUSHED);
      expect(val).toEqual(1);
    });
  });
});




/**
 * FnQueue
 */
describe('FnQueueAbstract', () => {
  it('should extend FnQueueAbstract class', (done) => {
    class MyClass extends FnQueueAbstract {
      public val = 10;

      private queueFlushed() {
        console.log('Queue flushed: ' + this.val);
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
    myClass.increaseValXTimes(10, () => {
      expect(myClass.val).toEqual(20);
      done();
    });
  });
});