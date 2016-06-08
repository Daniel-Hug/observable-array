ObservableArray.prototype.addDomObserver = (function() {

	var nodeMap = new Map();

	// renderer will be called for each item in arr, and should return a DOM node.
	// renderAll returns a single node containing the rendered nodes
	function renderAll(arr, renderer) {
		var elements = [].map.call(arr, function(obj) {
			var node = renderer.apply(null, arguments);
			nodeMap.set(obj, node);
			return node;
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

		function handleReverse() {
			var docFrag = document.createDocumentFragment();
			while (parent.lastChild) {
				docFrag.appendChild(
					parent.removeChild(parent.lastChild)
				);
			}
			parent.appendChild(docFrag);
		}
		observableArray.on('reverse', handleReverse);

		function handleReorder() {
			var docFrag = document.createDocumentFragment();
			observableArray.forEach(function(obj){
				var node = nodeMap.get(obj);
				parent.removeChild(node);
				docFrag.appendChild(node);
			});
			parent.appendChild(docFrag);
		}
		observableArray.on('sort', handleReorder);

		return {
			stop: function() {
				observableArray
					.off('unshift push', handleAdd)
					.off('shift pop', handleRemove)
					.off('splice', handleSplice)
					.off('reverse', handleReverse)
					.off('sort', handleReorder);
			}
		}
	};
})();