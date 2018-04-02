"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
describe('FnQueue', function () {
    describe('isProcessing()', function () {
        it('should return the value if the queue is being processed', function () {
            var fnQueueSrv = new src_1.FnQueue();
            expect(fnQueueSrv.isProcessing()).toEqual(false);
            fnQueueSrv['processingQueue'] = true;
            expect(fnQueueSrv.isProcessing()).toEqual(true);
        });
    });
    describe('push()', function () {
        it('should push functions to the queue, but not execute them', function () {
            var fnQueueSrv = new src_1.FnQueue();
            var fnOne = function () { };
            var fnTwo = function () { };
            fnQueueSrv.push(fnOne);
            fnQueueSrv.push(fnTwo);
            expect(fnQueueSrv['queue'].length).toEqual(2);
            expect(fnQueueSrv.isProcessing()).toEqual(false);
        });
    });
    describe('execute() & next()', function () {
        it('should push function to queue and execute', function (done) {
            var val = 10;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                expect(val).toEqual(11);
                done();
            });
            var fnOne = function () {
                val++;
                fnQueueSrv.next();
            };
            fnQueueSrv.execute(fnOne);
        });
        it('should execute after other functions in queue', function (done) {
            var val = 10;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                expect(val).toEqual(15);
                done();
            });
            var fnOne = function (cb) {
                val = 20;
                cb();
            };
            var fnTwo = function (cb) {
                val = 15;
                cb();
            };
            fnQueueSrv.push(fnOne);
            fnQueueSrv.execute(fnTwo);
        });
        it('should execute and use callback function', function (done) {
            var val = 10;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                expect(val).toEqual(11);
                done();
            });
            var fnOne = function (cb) {
                val++;
                cb();
            };
            fnQueueSrv.execute(fnOne);
        });
        it('should flush queue even know function does not fire callback', function (done) {
            var val = 10;
            var fnTimeoutCalled = false;
            var fnQueueSrv = new src_1.FnQueue(null, { maxFnExecuteTime: 100 });
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FUNCTION_TIMEOUT, function () {
                fnTimeoutCalled = true;
            });
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                expect(val).toEqual(12);
                expect(fnTimeoutCalled).toEqual(true);
                done();
            });
            var fnOne = function (cb) {
                val++;
            };
            var fnTwo = function (cb) {
                setTimeout(function () {
                    val++;
                    cb();
                }, 10);
            };
            fnQueueSrv.push(fnOne);
            fnQueueSrv.execute(fnTwo);
        });
    });
    describe('kill()', function () {
        it('should kill the processing and empty the queue', function (done) {
            var val = 10;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                expect(val).toEqual(11);
                done();
            });
            var fnOne = function (cb) {
                setTimeout(function () {
                    val++;
                    cb();
                }, 100);
            };
            var fnTwo = function (cb) {
                setTimeout(function () {
                    val++;
                    cb();
                }, 100);
            };
            fnQueueSrv.push(fnOne);
            fnQueueSrv.execute(fnTwo);
            setTimeout(function () {
                fnQueueSrv.kill();
            }, 50);
        });
    });
    describe('on()', function () {
        it('should listen to events fired', function () {
            var val = 0;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.on(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                val++;
            });
            fnQueueSrv['eventHandler'].emit(src_1.FN_QUEUE_EVENTS.FLUSHED);
            fnQueueSrv['eventHandler'].emit(src_1.FN_QUEUE_EVENTS.FLUSHED);
            expect(val).toEqual(2);
        });
    });
    describe('once()', function () {
        it('should listen to event only once', function () {
            var val = 0;
            var fnQueueSrv = new src_1.FnQueue();
            fnQueueSrv.once(src_1.FN_QUEUE_EVENTS.FLUSHED, function () {
                val++;
            });
            fnQueueSrv['eventHandler'].emit(src_1.FN_QUEUE_EVENTS.FLUSHED);
            fnQueueSrv['eventHandler'].emit(src_1.FN_QUEUE_EVENTS.FLUSHED);
            expect(val).toEqual(1);
        });
    });
});
describe('FnQueueAbstract', function () {
    it('should extend FnQueueAbstract class', function (done) {
        var MyClass = (function (_super) {
            __extends(MyClass, _super);
            function MyClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.val = 10;
                return _this;
            }
            MyClass.prototype.queueFlushed = function () {
                console.log('Queue flushed: ' + this.val);
            };
            MyClass.prototype.increaseVal = function () {
                var _this = this;
                setTimeout(function () {
                    _this.val++;
                    _this.fnQueue.next();
                }, 10);
            };
            MyClass.prototype.increaseValXTimes = function (numberOftimes, cb) {
                for (var i = 0; i < numberOftimes; i++) {
                    this.fnQueue.push(this.increaseVal);
                }
                this.fnQueue.once(src_1.FN_QUEUE_EVENTS.FLUSHED, cb);
                this.fnQueue.execute();
            };
            return MyClass;
        }(src_1.FnQueueAbstract));
        var myClass = new MyClass();
        myClass.increaseValXTimes(10, function () {
            expect(myClass.val).toEqual(20);
            done();
        });
    });
});
//# sourceMappingURL=fn-queue.spec.js.map