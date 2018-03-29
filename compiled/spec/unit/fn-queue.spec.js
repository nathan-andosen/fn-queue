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
describe('FnQueue Abstract class', function () {
    describe('execute()', function () {
        it('should do something', function (done) {
            var MyClass = (function (_super) {
                __extends(MyClass, _super);
                function MyClass() {
                    var _this = _super.call(this) || this;
                    _this.val = 10;
                    return _this;
                }
                MyClass.prototype.queueFlushed = function () {
                    console.log('Queue flushed: ' + this.val);
                };
                MyClass.prototype.getVal = function () {
                    return this.val;
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
            }(src_1.FnQueue));
            var myClass = new MyClass();
            myClass.increaseValXTimes(10, function () {
                var val = myClass.getVal();
                expect(val).toEqual(20);
                done();
            });
        });
    });
});
describe('FnQueueService', function () {
});
//# sourceMappingURL=fn-queue.spec.js.map