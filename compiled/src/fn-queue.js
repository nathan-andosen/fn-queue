"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FN_QUEUE_EVENTS = {
    FLUSHED: 'flushed',
    ERROR: 'error'
};
var FnQueueService = (function () {
    function FnQueueService(scope) {
        this.queue = [];
        this.processingQueue = false;
        this.maxFnExecuteTime = 1000 * 60;
        this.scope = (scope) ? scope : window;
    }
    FnQueueService.prototype.push = function (fn) {
        if (fn) {
            this.queue.push(fn);
        }
    };
    FnQueueService.prototype.execute = function (fn) {
        this.push(fn);
        if (!this.processingQueue) {
            this.next();
        }
    };
    FnQueueService.prototype.next = function () {
        var _this = this;
        this.processingQueue = true;
        if (this.fnExecuteTimeoutId) {
            clearTimeout(this.fnExecuteTimeoutId);
        }
        if (this.queue.length < 1) {
            this.processingQueue = false;
            return;
        }
        var fn = this.queue.shift();
        fn.apply(this.scope);
        this.fnExecuteTimeoutId = setTimeout(function () {
            _this.next();
        }, this.maxFnExecuteTime);
    };
    FnQueueService.prototype.kill = function () { };
    return FnQueueService;
}());
exports.FnQueueService = FnQueueService;
var FnQueue = (function () {
    function FnQueue() {
        this.fnQueue = null;
        this.fnQueue = new FnQueueService(this);
    }
    return FnQueue;
}());
exports.FnQueue = FnQueue;
//# sourceMappingURL=fn-queue.js.map