var DomArray = (function() {

	// constructor

	function DomArray(collection, parent, renderer) {
		var t = this;
		t.parent = parent;
		t.renderer = renderer;
		t.collection = collection;
		t.nodeMap = typeof Map === 'function' ? new Map() : null;

		// render and append each item in collection
		t.push.apply(t, collection);

		// observe changes on collection if it's observable
		if (typeof collection.on === 'function') {
			var methods = 'shift pop unshift push splice reverse sort'.split(' ');
			each(methods, function(method) {
				collection.on(method, function(method) {
					var methodArgs = sliceArr.call(arguments, 1);
					t[method].apply(t, methodArgs);
				});
			});
		}
	};


	// methods that remove items

	DomArray.prototype.shift = function() {
		this.parent.removeChild(this.parent.firstChild);
	};

	DomArray.prototype.pop = function() {
		this.parent.removeChild(this.parent.lastChild);
	};


	// methods that add items

	DomArray.prototype.push = function() {
		if (!arguments.length) return;
		var node = renderAll(this.nodeMap, arguments, this.renderer);
		this.parent.appendChild(node);
	};

	DomArray.prototype.unshift = function() {
		if (!arguments.length) return;
		var node = renderAll(this.nodeMap, arguments, this.renderer);
		this.parent.insertBefore(node, this.parent.firstChild);
	};


	// other methods

	DomArray.prototype.splice = function(start, deleteCount) {
		var childNodes = this.parent.childNodes;

		// If `start` is negative, begin that many elements from the end
		start = start < 0 ? childNodes.length + start : start

		// remove the element at index `start` `deleteCount` times
		deleteCount = typeof deleteCount === 'number' ? deleteCount : childNodes.length - start;
		var stop = start + deleteCount;
		for (var i = start; i < stop && childNodes[start]; i++) {
			this.parent.removeChild(childNodes[start]);
		}

		// add new elements at index `start`
		if (arguments.length > 2) {
			var newItems = [].slice.call(arguments, 2);
			var node = renderAll(this.nodeMap, newItems, this.renderer);
			this.parent.insertBefore(node, childNodes[start]);
		}
	};

	DomArray.prototype.reverse = function() {
		var docFrag = document.createDocumentFragment();

		// append every last child of parent to doc frag
		while (this.parent.lastChild) {
			docFrag.appendChild(
				this.parent.removeChild(this.parent.lastChild)
			);
		}

		// append doc frag to parent
		this.parent.appendChild(docFrag);
	};

	DomArray.prototype.sort = function() {
		if (!this.nodeMap) throw new TypeError('DomArray.prototype.sort() requires Map support.');
		var docFrag = document.createDocumentFragment();
		each(this.collection, function(obj){
			var node = this.nodeMap.get(obj);
			this.parent.removeChild(node);
			docFrag.appendChild(node);
		}, this);
		this.parent.appendChild(docFrag);
	};


	// helper functions

	var sliceArr = [].slice;

	function each(arr, fn, scope) {
		for (var i = 0, l = arr.length; i < l; i++) {
			fn.call(scope, arr[i], i, arr);
		}
	}

	// renderAll returns a single node containing the rendered nodes
	function renderAll(nodeMap, collection, renderer) {
		if (collection.length > 1) {
			var docFrag = document.createDocumentFragment();
			each(collection, function(item) {
				// call renderer (should return a DOM node) for each item in collection
				var node = renderer.apply(null, arguments);
				if (nodeMap) nodeMap.set(item, node);
				docFrag.appendChild(node);
			});
			return docFrag;
		} else {
			return renderer(collection[0], 0, collection);
		}
	}

	return DomArray;
})();