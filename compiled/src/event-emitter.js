"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = (function () {
    function EventEmitter(scope) {
        this.events = {};
        this.scope = (scope) ? scope : null;
    }
    EventEmitter.prototype.generateId = function () {
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
            .toUpperCase();
    };
    EventEmitter.prototype.emit = function (eventName, data) {
        var events = this.events[eventName];
        if (events) {
            for (var i = 0; i < events.length; i++) {
                events[i].call(this.scope, data);
            }
        }
    };
    EventEmitter.prototype.subscribe = function (eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        fn['subscribeId'] = this.generateId();
        this.events[eventName].push(fn);
    };
    EventEmitter.prototype.unsubscribe = function (eventName, fn) {
        if (!fn['subscribeId']) {
            return;
        }
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i]['subscribeId'] === fn['subscribeId']) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=event-emitter.js.map