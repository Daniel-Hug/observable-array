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
	// renderAll returns a single node containing the rendered nodes
	function renderAll(arr, renderer) {
		var elements = [].map.call(arr, function(obj) {
			return obj.node = renderer.apply(null, arguments);
		});

		if (elements.length > 1) {
			var docFrag = document.createDocumentFragment();
			elements.forEach(function(el) {
				docFrag.appendChild(el);
			});
			return docFrag;
		} else {
			return elements[0];
		}
	}

	return function addDomObserver(parent, renderer) {
		var observableArray = this;

		// render current state
		parent.appendChild(renderAll(observableArray, renderer));

		function handleAdd(methodName) {
			var newItems = [].slice.call(arguments, 1);
			var appendable = renderAll(newItems, renderer);
			if (methodName === 'push') {
				parent.appendChild(appendable);
			} else {
				parent.insertBefore(appendable, parent.firstChild);
			}
		}
		observableArray.on('unshift push', handleAdd);

		function handleRemove(methodName) {
			parent.removeChild(parent[methodName === 'pop' ? 'lastChild' : 'firstChild']);
		}
		observableArray.on('shift pop', handleAdd);

		// render DOM changes to match the call to splice
		function handleSplice(methodName, start, deleteCount) {
			var childNodes = parent.childNodes;

			// If negative, begin that many elements from the end
			start = start < 0 ? childNodes.length + start : start

			// remove the element at index `start` `deleteCount` times
			deleteCount = typeof deleteCount === 'number' ? deleteCount : childNodes.length - start;
			var stop = start + deleteCount;
			for (var i = start; i < stop && childNodes[start]; i++) {
				parent.removeChild(childNodes[start]);
			}

			// add new elements at index `start`
			if (arguments.length > 3) {
				var newItems = [].slice.call(arguments, 3);
				var appendable = renderAll(newItems, renderer);
				parent.insertBefore(appendable, childNodes[start]);
			}
		}
		observableArray.on('splice', handleSplice);

		function handleReorder() {
			var docFrag = document.createDocumentFragment();
			observableArray.forEach(function(obj){
				parent.removeChild(obj.node);
				docFrag.appendChild(obj.node);
			});
			parent.appendChild(docFrag);
		}
		observableArray.on('reverse sort', handleReorder);

		return {
			stop: function() {
				observableArray
					.off('unshift push', handleAdd)
					.off('shift pop', handleRemove)
					.off('splice', handleSplice)
					.off('reverse sort', handleReorder);
			}
		}
	};
})();