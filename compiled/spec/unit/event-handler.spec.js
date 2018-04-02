"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_handler_1 = require("../../src/event-handler");
describe('EventHandler', function () {
    it('should emit event', function () {
        var eventHandler = new event_handler_1.EventHandler();
        var a = 10;
        var fnOne = function () {
            a = 20;
        };
        eventHandler.subscribe('test', fnOne);
        eventHandler.emit('test');
        expect(a).toEqual(20);
    });
    it('should subscribe and unsubscribe events', function () {
        var eventHandler = new event_handler_1.EventHandler();
        var fnOne = function () { };
        eventHandler.subscribe('test', fnOne);
        expect(eventHandler['events']['test']).toBeDefined();
        expect(eventHandler['events']['test'].length).toEqual(1);
        eventHandler.unsubscribe('test', fnOne);
        expect(eventHandler['events']['test'].length).toEqual(0);
    });
    it('should subscribe and unsubscribe for function inside class', function () {
        var MyClass = (function () {
            function MyClass() {
                this.valOne = 0;
                this.eventHandler = new event_handler_1.EventHandler(this);
            }
            MyClass.prototype.listenToValUpdate = function (data) {
                this.valOne = data;
            };
            MyClass.prototype.subscribeTestEvent = function () {
                this.eventHandler.subscribe('valUpdate', this.listenToValUpdate);
            };
            MyClass.prototype.unsubscribeTestEvent = function () {
                this.eventHandler.unsubscribe('valUpdate', this.listenToValUpdate);
            };
            MyClass.prototype.setVal = function (val) {
                this.valOne = 0;
                this.eventHandler.emit('valUpdate', val);
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
//# sourceMappingURL=event-handler.spec.js.map