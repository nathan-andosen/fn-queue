![Test Coverage-shield-badge-1](https://img.shields.io/badge/Test%20Coverage-100%25-brightgreen.svg)

# FnQueue

An easy way to execute asynchronous javascript functions in a queue structure.

# How to use

## Installation

### Typescript

```javascript
import { FnQueue } from '@thenja/fn-queue';
let fnQueue = new FnQueue();
```

### Javascript (browser)

```javascript
<script src="dist/fn-queue.min.js" type="text/javascript"></script>
var fnQueue = new FnQueue();
```

## Constructor

### new FnQueue(scope: any, options)

__scope__ : The scope "this" will apply too. (View examples below for a better understanding).

__options:__ : Options to config the queue service. Options below:

|Option|Type|Default value|Description|
|------|----|-------------|-----------|
|maxFnExecuteTime|number (milliseconds)|30 seconds|The max allowed time that a function can execute for. If a function does not execute within this time, the next function in the queue will be executed. This is to prevent the queue from getting blocked|

## Methods

|Method|Description|
|------|-----------|
|isProcessing(): boolean|Returns true if the queue has functions in it and they are currently being executed|
|push(fn: Function)|Push a function to the queue but do not execute it|
|execute(fn: Function)|Push a function to the queue and begin executing the functions in the queue|
|next()|Execute the next function in the queue|
|kill()|Basically empties the queue. If a function is currently being invoked, it will complete before the queue stops processing.|
|on(eventName: string, fn: Function)|Listen to events fired by the queue (Events listed below)|
|once(eventName: string, fn: Function)|Listen to an event once (Events listed below)|

### Events

|Event|Description|
|-----|-----------|
|flushed|Fired when the queue has finished executing and is empty|
|function-timeout|Fired when a function did not finish executing in the allowed time|


## Use cases & Exmples

### Use as a service

```javascript
import { FnQueue } from '@thenja/fn-queue';
let fnQueue = new FnQueue();
// In the functions below, you can see there are two ways to notify that you
// have finished executing the function. Either use the callback function, or
// fire the fnQueue.next() function.
let fnOne = (callback) => {
  // do something, when finished executing, fire the callback function
  callback();
};
let fnTwo = () => {
  // do something, when finished executing, fire queue next() function
  fnQueue.next();
};
fnQueue.execute(fnOne);
fnQueue.execute(fnTwo);
```

### Use a different scope

```javascript
let scope = { val: 10 };
let fnQueue = new FnQueue(scope);
let fnOne = () => {
  // "this" now points to the scope object above
  this.val = 100;
};
fnQueue.execute(fnOne);
```

### Listen to events

```javascript
import { FnQueue, FN_QUEUE_EVENTS } from '@thenja/fn-queue';
let fnQueue = new FnQueue();
let fnOne = () => {};
let fnTwo = () => {}:
fnQueue.push(fnOne);
fnQueue.push(fnTwo);
fnQueue.on(FN_QUEUE_EVENTS.FLUSHED, () => {
  console.log('Finished executing functions...');
});
fnQueue.execute();
```

### Use as an abstract class

A class that extends the FnQueueAbstract class will basically have a
property (_this.fnQueue_) exposed which is just an instance of the FnQueue
class.

```javascript
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
```

# Development

``npm run init`` - Setup the app for development (run once after cloning)

``npm run dev`` - Run this command when you want to work on this app. It will
compile typescript, run tests and watch for file changes.

## Distribution

``npm run build -- -v <version>`` - Create a distribution build of the app.

__-v (version)__ - _[Optional]_ Either "patch", "minor" or "major". Increase
the version number in the package.json file.

The build command creates a _/compiled_ directory which has all the javascript
compiled code and typescript definitions. As well, a _/dist_ directory is 
created that contains a minified javascript file.

## Testing

_Tests are automatically ran when you do a build._

``npm run test`` - Run the tests. The tests will be ran in a nodejs environment.
You can run the tests in a browser environment by opening the file 
_/spec/in-browser/SpecRunner.html_.

# License

MIT © [Nathan Anderson](https://github.com/nathan-andosen)