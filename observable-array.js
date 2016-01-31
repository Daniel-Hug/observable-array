var ObservableArray = (function() {
	var arrProto = Array.prototype;



	/*
		constructor
	*/

	function ObservableArray(collection) {
		// calling with `new` is optional
		if (!(this instanceof ObservableArray)) {
			return new ObservableArray(collection);
		}

		// add items from passed `collection` to `this`
		collection = collection || [];
		for (var i = 0; i < collection.length; i++) {
			this[i] = collection[i];
		}

		// set length so it acts like an array: http://stackoverflow.com/a/6599447/552067
		this.length = collection.length;

		// keep list of observing functions for subscribable.js
		this.subscribers = {};
	}



	/*
		make changes observable via subscribable.js
	*/

	ObservableArray.prototype = new Subscribable();



	/*
		methods from Array.prototype that modify `this`
	*/

	var modifyingMethods = 'pop push shift unshift splice reverse sort'.split(' ');

	// add *clones* of the above native array methods to ObservableArray.prototype
	// the clones should notify observers after completion
	modifyingMethods.forEach(function(methodName) {
		var method = arrProto[methodName];
		ObservableArray.prototype[methodName] = function() {
			var returnValue = method.apply(this, arguments);
			var args = [methodName].concat(arrProto.slice.call(arguments));
			this.trigger.apply(this, args);
			return returnValue;
		};
	});



	/*
		methods from Array.prototype that don't modify `this`
	*/

	var returningMethods = 'slice concat join some every forEach map filter reduce reduceRight indexOf lastIndexOf toString toLocaleString'.split(' ');

	// add the above native array methods to ObservableArray.prototype
	returningMethods.forEach(function(methodName) {
		ObservableArray.prototype[methodName] = arrProto[methodName];
	});



	return ObservableArray;
})();