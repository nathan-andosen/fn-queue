"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_emitter_1 = require("../../src/event-emitter");
describe('EventEmitter', function () {
    it('should emit event', function () {
        var eventEmitter = new event_emitter_1.EventEmitter();
        var a = 10;
        var fnOne = function () {
            a = 20;
        };
        eventEmitter.subscribe('test', fnOne);
        eventEmitter.emit('test');
        expect(a).toEqual(20);
    });
    it('should subscribe and unsubscribe events', function () {
        var eventEmitter = new event_emitter_1.EventEmitter();
        var fnOne = function () { };
        eventEmitter.subscribe('test', fnOne);
        expect(eventEmitter['events']['test']).toBeDefined();
        expect(eventEmitter['events']['test'].length).toEqual(1);
        eventEmitter.unsubscribe('test', fnOne);
        expect(eventEmitter['events']['test'].length).toEqual(0);
    });
    it('should subscribe and unsubscribe for function inside class', function () {
        var MyClass = (function () {
            function MyClass() {
                this.valOne = 0;
                this.eventEmitter = new event_emitter_1.EventEmitter(this);
            }
            MyClass.prototype.listenToValUpdate = function (data) {
                this.valOne = data;
            };
            MyClass.prototype.subscribeTestEvent = function () {
                this.eventEmitter.subscribe('valUpdate', this.listenToValUpdate);
            };
            MyClass.prototype.unsubscribeTestEvent = function () {
                this.eventEmitter.unsubscribe('valUpdate', this.listenToValUpdate);
            };
            MyClass.prototype.setVal = function (val) {
                this.valOne = 0;
                this.eventEmitter.emit('valUpdate', val);
            };
            return MyClass;
        }());
        var myClass = new MyClass();
        myClass.subscribeTestEvent();
        myClass.setVal(100);
        expect(myClass['valOne']).toEqual(100);
        myClass.unsubscribeTestEvent();
        myClass.setVal(200);
        expect(myClass['valOne']).toEqual(0);
    });
});
//# sourceMappingURL=event-emitter.spec.js.map