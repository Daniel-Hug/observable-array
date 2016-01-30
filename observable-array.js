var ObservableArray = (function() {

	/*
		constructor
	*/
	function ObservableArray(collection) {
		// add items from passed `collection` to `this`
		collection = collection || [];
		for (var i = 0; i < collection.length; i++) {
			this[i] = collection[i];
		}

		// set length so it acts like an array: http://stackoverflow.com/a/6599447/552067
		this.length = collection.length;
		
		// keep list of observing functions
		this.observers = {};
	}



	/*
		cloned methods (from Array.prototype)
	*/

	// methods of Array.prototype that modify `this`
	var modifyingMethods = 'pop push shift unshift splice reverse sort'.split(' ');

	// add clones of the above native array methods to ObservableArray.prototype
	// the clones should notify observers after completion
	var arrProto = Array.prototype;
	modifyingMethods.forEach(function(methodName) {
		var method = arrProto[methodName];
		ObservableArray.prototype[methodName] = function() {
			var returnValue = method.apply(this, arguments);
			var args = [methodName].concat(arrProto.slice.call(arguments));
			this.notify.apply(this, args);
			return returnValue;
		};
	});

	// methods of Array.prototype that don't modify `this`
	var returningMethods = 'slice concat join some every forEach map filter reduce reduceRight indexOf lastIndexOf toString toLocaleString'.split(' ');

	// add clones of the above native array methods to ObservableArray.prototype
	// the clones should notify observers after completion
	returningMethods.forEach(function(methodName) {
		var method = arrProto[methodName];
		ObservableArray.prototype[methodName] = function() {
			return method.apply(this, arguments);
		};
	});



	/*
		custom methods
	*/

	// add an observer
	ObservableArray.prototype.on = function on(methodName, handler) {
		if (!this.observers[methodName]) this.observers[methodName] = [];
		this.observers[methodName].push(handler);
	};

	// remove observers
	ObservableArray.prototype.off = function off(methodName, handler) {
		if (methodName) {
			if (handler) {
				// unsubscribe an observer from a method
				var fnIndex = this.observers[methodName].indexOf(handler);
				if (fnIndex >= 0) this.observers[methodName].splice(fnIndex, 1);
			} else {
				// unsubscribe all observers of a method
				this.observers[methodName] = [];
			}
		} else {
			// remove all observers from array
			for (methodName in this.observers) {
				this.observers[methodName] = [];
			}
		}
	};

	// notify observers
	ObservableArray.prototype.notify = function notify(methodName) {
		var args = arguments;
		var context = this;
		function caller(handler) {
			handler.apply(context, args);
		}
		(this.observers[methodName] || []).forEach(caller);
		if (methodName !== 'change') (this.observers.change || []).forEach(caller);
	};


	return ObservableArray;
})();