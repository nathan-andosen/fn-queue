/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventHandler = (function () {
    function EventHandler(scope) {
        this.events = {};
        this.scope = (scope) ? scope : null;
    }
    EventHandler.prototype.generateId = function () {
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5))
            .toUpperCase();
    };
    EventHandler.prototype.emit = function (eventName, data) {
        var events = this.events[eventName];
        if (events) {
            for (var i = 0; i < events.length; i++) {
                events[i].call(this.scope, data);
            }
        }
    };
    EventHandler.prototype.subscribe = function (eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        fn['subscribeId'] = this.generateId();
        this.events[eventName].push(fn);
    };
    EventHandler.prototype.unsubscribe = function (eventName, fn) {
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
    return EventHandler;
}());
exports.EventHandler = EventHandler;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


// Our webpack.unit.tests.config.js file uses this to require all unit test files
// so they can be tested in a browser for debugging

// require all test files
var testsContext = __webpack_require__(2);
testsContext.keys().forEach(testsContext);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./event-handler.spec": 3,
	"./fn-queue.spec": 4
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 2;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var event_handler_1 = __webpack_require__(0);
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
var src_1 = __webpack_require__(5);
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(6));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var event_handler_1 = __webpack_require__(0);
exports.FN_QUEUE_EVENTS = {
    FLUSHED: 'flushed',
    FUNCTION_TIMEOUT: 'function-timeout'
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


/***/ })
/******/ ]);
//# sourceMappingURL=spec.js.map