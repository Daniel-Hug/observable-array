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


### observe changes

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


### add dom observers with [DOM Array](https://github.com/Daniel-Hug/dom-array)

DOM Array will subscribe to the following events and automatically update a list of elements to match the new state of the array:
  - `shift`
  - `pop`
  - `unshift`
  - `push`
  - `splice`
  - `reverse`
  - `sort` (requires [Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) support)

```js
// create an observable array
var nums = new ObservableArray([1, 2, 3]);

// set up DOM Array passing observable array
var ul = document.querySelector('ul');
var listView = new DomArray(nums, ul, function renderItem(num) {
	var li = document.createElement('li');
	li.textContent = 'number: ' + num;
	return li;
});

// add 2 items
nums.push(4, 5);
```