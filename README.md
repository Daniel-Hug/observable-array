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

```js
var ul = document.querySelector('ul');

function itemRenderer(num) {
	var li = document.createElement('li');
	li.textContent = 'number: ' + num;
	return li;
}

// add DOM observer:
var observer = observableArray.addDomObserver(ul, itemRenderer);

// unsubscribe DOM observer:
observer.stop();
```