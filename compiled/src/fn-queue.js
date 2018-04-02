"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_handler_1 = require("./event-handler");
exports.FN_QUEUE_EVENTS = {
    FLUSHED: 'flushed',
    FUNCTION_TIMEOUT: 'functionTimeout'
};
var FnQueue = (function () {
    function FnQueue(scope, options) {
        this.queue = [];
        this.processingQueue = false;
        this.maxFnExecuteTime = 1000 * 30;
        this.scope = (scope) ? scope : {};
        this.eventHandler = new event_handler_1.EventHandler(this.scope);
        options = options || {};
        if (options.maxFnExecuteTime) {
            this.maxFnExecuteTime = options.maxFnExecuteTime;
        }
    }
    FnQueue.prototype.isProcessing = function () {
        return this.processingQueue;
    };
    FnQueue.prototype.push = function (fn) {
        if (fn) {
            this.queue.push(fn);
        }
    };
    FnQueue.prototype.execute = function (fn) {
        this.push(fn);
        if (!this.processingQueue) {
            this.next();
        }
    };
    FnQueue.prototype.next = function () {
        this.processingQueue = true;
        if (this.fnExecuteTimeoutId) {
            clearTimeout(this.fnExecuteTimeoutId);
        }
        if (this.queue.length < 1) {
            this.processingQueue = false;
            this.eventHandler.emit(exports.FN_QUEUE_EVENTS.FLUSHED);
            return;
        }
        this.startMaxExecutionTimeout();
        var fn = this.queue.shift();
        var self = this;
        fn.apply(this.scope, [function () {
                self.next();
            }]);
    };
    FnQueue.prototype.startMaxExecutionTimeout = function () {
        var _this = this;
        this.fnExecuteTimeoutId = setTimeout(function () {
            _this.eventHandler.emit(exports.FN_QUEUE_EVENTS.FUNCTION_TIMEOUT);
            _this.next();
        }, this.maxFnExecuteTime);
    };
    FnQueue.prototype.kill = function () {
        this.queue = [];
    };
    FnQueue.prototype.on = function (eventName, fn) {
        this.eventHandler.subscribe(eventName, fn);
    };
    FnQueue.prototype.once = function (eventName, fn) {
        var _this = this;
        var onceFn = function (data) {
            fn.call(_this.scope, data);
            _this.eventHandler.unsubscribe(eventName, onceFn);
        };
        this.eventHandler.subscribe(eventName, onceFn);
    };
    return FnQueue;
}());
exports.FnQueue = FnQueue;
var FnQueueAbstract = (function () {
    function FnQueueAbstract() {
        this.fnQueue = null;
        this.fnQueue = new FnQueue(this);
    }
    return FnQueueAbstract;
}());
exports.FnQueueAbstract = FnQueueAbstract;
//# sourceMappingURL=fn-queue.js.map