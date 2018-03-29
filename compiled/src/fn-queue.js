"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("./event-emitter");
exports.FN_QUEUE_EVENTS = {
    FLUSHED: 'flushed',
    ERROR: 'error'
};
var FnQueueService = (function () {
    function FnQueueService(scope, options) {
        this.queue = [];
        this.processingQueue = false;
        this.maxFnExecuteTime = 1000 * 60;
        this.scope = (scope) ? scope : {};
        this.eventEmitter = new event_emitter_1.EventEmitter(this.scope);
        options = options || {};
        if (options.maxFnExecuteTime) {
            this.maxFnExecuteTime = options.maxFnExecuteTime;
        }
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
            this.eventEmitter.emit(exports.FN_QUEUE_EVENTS.FLUSHED);
            return;
        }
        var fn = this.queue.shift();
        fn.apply(this.scope);
        this.fnExecuteTimeoutId = setTimeout(function () {
            _this.eventEmitter.emit(exports.FN_QUEUE_EVENTS.ERROR);
            _this.next();
        }, this.maxFnExecuteTime);
    };
    FnQueueService.prototype.kill = function () { };
    FnQueueService.prototype.on = function (eventName, fn) {
        this.eventEmitter.subscribe(eventName, fn);
    };
    FnQueueService.prototype.once = function (eventName, fn) {
        var _this = this;
        var onceFn = function (data) {
            fn.call(_this.scope, data);
            _this.eventEmitter.unsubscribe(eventName, onceFn);
        };
        this.eventEmitter.subscribe(eventName, onceFn);
    };
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