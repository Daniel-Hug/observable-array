Subscribable.js
===============

A tiny extendable JS constructor for custom event listening. Use it in the browser or in node:

## Install

```
npm install subscribable.js
```
**OR**
```
bower install subscribable.js
```


## Simple usage

```js
var Daniel = new Subscribable();

Daniel.on('puke', function(event, msg) {
	console.log('Eeeww! ' + msg);
});

Daniel.trigger('puke', 'That was gross!');
//=> Eeeww! That was gross!
```

## Add events to any constructor

In this example the `Person` contructor inherits its event subscribing capability from `Subscribable`:

```js
var Person = function(name) {
	this.subscribers = {};
	this.name = name;
};

Person.prototype = new Subscribable();
Person.prototype.sayName = function() {
	console.log('Hi! I\'m ' + this.name + '.');
};

var Daniel = new Person('Daniel');

Daniel.sayName();
//=> Hi! I'm Daniel.

Daniel.on('smile', function showTeeth(event, numTeeth) {
	console.log('Oh look! ' + this.name + ' has ' + numTeeth + ' teeth.');
});

Daniel.trigger('smile', 30);
//=> Oh look! Daniel has 30 teeth.
```

## Methods

 - **Subscibe to events:** `.on(eventsStr, handlerFn, callNow)`
   - if `callNow` is truthy, `handlerFn` is called right away.
   - `eventsStr` should be a space-seperated list of events, e.g. `'start stop'`. if `eventsStr` is `'any'`, then `handlerFn` will be called when any event is triggered on this instance of `Subscribable`, otherwise it will be called whenever an event in `eventsStr` is triggered.
 - **Trigger events:** `.trigger(eventStr[, value1[, ...[, valueN]]])`
   - trigger the `eventStr` event. Any subscribing handlers will be called with the same arguments passed to `.trigger()`.
 - **Unsubscribe from events:** `.off(eventsStr, handlerFn)`
   - pass no arguments to cancel all subscriptions
   - pass `eventsStr` (a space-separated list of events) to unsubscribe all functions from those events
   - or pass `eventsStr` and a function to unsubscribe a specific function from those events


## Extend

Add your own methods to the `Subscribable` prototype:

```js
// subscribe, then unsubscribe after first trigger
Subscribable.prototype.once = function(event, fn) {
	var t = this;
	this.on(event, function() {
		fn.apply(this, arguments);
		t.off(event, fn);
	});
};
```
