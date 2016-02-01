/* 
	usage:

	// setup:
	var observableArray = new ObservableArray([1,2,3,4,5,6,7]);
	var ul = document.querySelector('ul');
	var observer = observableArray.addDomObserver(ul, function(num) {
		var li = document.createElement('li');
		li.textContent = 'number: ' + num;
		return li;
	});

	// changes are reflected in DOM:
	observableArray.push(8);
	observableArray.splice(2);

	// unsubscribe DOM observer:
	observer.stop();
*/

ObservableArray.prototype.addDomObserver = (function() {

	// renderer will be called for each item in arr, and should return a DOM node.
	// all DOM nodes returned will be appended to a document fragment which will be returned
	function renderMultiple(arr, renderer) {
		var docFrag = document.createDocumentFragment();
		[].map.call(arr, renderer).forEach(function(el) {
			docFrag.appendChild(el);
		});
		return docFrag;
	}

	// acts like Array##splice for parent's childNodes
	function spliceNodes(parent, start, deleteCount /*[, newNode1, newNode2]*/) {
		var childNodes = parent.childNodes;

		// remove the element at index `start` `deleteCount` times
		var stop = typeof deleteCount === 'number' ? start + deleteCount : parent.childElementCount;
		for (var i = start; i < stop && childNodes[start]; i++) {
			parent.removeChild(childNodes[start]);
		}

		// add new elements at index `start`
		if (arguments.length > 3) {
			var newCells = [].slice.call(arguments, 3);
			var docFrag = renderMultiple(newCells, renderCell);
			parent.insertBefore(docFrag, childNodes[start]);
		}
	}

	return function addDomObserver(parent, renderer) {
		var observableArray = this;

		// render current state
		parent.appendChild(renderMultiple(observableArray, renderCell));

		// render and append new items when they're pushed
		function handlePush() {
			var newCells = [].slice.call(arguments, 1);
			parent.appendChild(renderMultiple(newCells, renderCell));
		}
		observableArray.on('push', handlePush);

		// render DOM changes to match the call to splice
		function handleSplice() {
			var spliceArgs = [].slice.call(arguments, 1)
			spliceNodes.apply(null, [parent].concat(spliceArgs))
		}
		observableArray.on('splice', handleSplice);

		return {
			stop: function() {
				observableArray
					.off('push', handlePush)
					.off('splice', handleSplice);
			}
		}
	};
})();