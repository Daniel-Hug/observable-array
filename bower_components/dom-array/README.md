# DOM Array

A JS module: Manipulate the DOM like an array

## create a new DOM Array instance

### example
```js
var ul = document.querySelector('ul');
var listView = new DomArray([1, 2, 3], ul, function renderItem(num) {
	var li = document.createElement('li');
	li.textContent = 'number: ' + num;
	return li;
});
```

### syntax
```js
var listView = new DomArray(
	collectionOfItems /* initial items to render and append */,
	parentElement /* rendered items will go in here */,
	renderItem /* function that accepts an item value and returns an appendable DOM node */
);
```

### Use array-like methods to modify the element list
```js
// add 4 items
nums.push(4, 5, 6, 7);


// remove last 2
nums.splice(-2);

// try these in the too!
// they work just like the native array methods:
// .shift() .pop() .unshift() .push() .splice() .reverse() .sort()
```

## use with observable arrays
Pair this module with an observable array module like [Observable Array](https://github.com/Daniel-Hug/observable-array). DOM Array will use the observable array's `.on()` method to subscribe to the following events:
  - `shift`
  - `pop`
  - `unshift`
  - `push`
  - `splice`
  - `reverse`
  - `sort`

DOM Array will then automatically update the list of elements to match the new state of the array.

### See it in action:
```js
// create an observable array
var nums = new ObservableArray([1, 2, 3]);

var listView = new DomArray(nums, $('ul')[0], function(num) {
    return $('&lt;li>').text('number: ' + num);
});

// add 2 items
nums.push(4, 5);
```