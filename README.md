# observable-array
lightweight JS observable array constructor with methods cloned from Array.prototype and changed to notify observers after completion


## usage

### create an observable array (requires [observable-array.js](observable-array.js))

```js
var observableArray = new ObservableArray([1,2,3,4,5,6,7]);
```

`ObservableArray` comes with all the native array methods you're used to: `push`, `slice`, `shift`, `forEach`, `map`, etc.:

```js
// these do what you'd expect but also notify observers
observableArray.push(8);
observableArray.splice(2);
```


### observe changes (uses method sniffing)

The following methods for observing the arrays (`.on()` and `.off()`) come from [subscribable.js](https://github.com/Daniel-Hug/subscribable.js) (a dependency of observable-array.js):

```js
observableArray.on('push', function(methodName, newItem1, newItem2/*, ...*/) {
	// new item(s) appended
});
```

```js
function handlePop() {
	// last item removed
}

// get notified when observableArray.pop() is called
observableArray.on('pop', handlePop);

// unsubscribe observable
observableArray.off('pop', handlePop);
```


### add dom observers (requires [dom-observer.js](dom-observer.js))

To use `addDomObserver` on an observable array, all of its items should be objects (non-primitives).
This is because a `node` property is added to each one pointing to the node returned by the renderer for that item.

```js
// create an observable array of objects
var nums = new ObservableArray([1,2,3,4,5,6,7,8,9,10,11].map(function(num){
	return { num: num };
}));

var ul = document.querySelector('ul');

function itemRenderer(num) {
	var li = document.createElement('li');
	li.textContent = 'number: ' + num;
	return li;
}

// add DOM observer:
var domObserver = observableArray.addDomObserver(ul, itemRenderer);

// unsubscribe DOM observer:
domObserver.stop();
```