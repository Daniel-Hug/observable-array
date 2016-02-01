// https://github.com/Daniel-Hug/subscribable
(function (root, factory) {
	if (typeof define === 'function' && define.amd)
		define(factory);
	else if (typeof exports === 'object')
		module.exports = factory();
	else root.Subscribable = factory();
})(this, function() {

	var Subscribable = function() {
		this.subscribers = {
			any: []
		};
	};

	Subscribable.prototype = {
		// Subscribe a function to each event in a space-separated
		// list of events. If an event doesn't exist, create it.
		on: function(eventsStr, fn, callNow) {
			eventsStr.split(' ').forEach(function(event) {
				if (!this.subscribers[event]) this.subscribers[event] = [];
				this.subscribers[event].push(fn);
			}, this);
			if (callNow) fn.call(this);
			return this;
		},

		// Pass a space-separated list of events and a function to unsubscribe a specific
		// function from those events, pass just the events to unsubscribe all functions
		// from those events, or don't pass any arguments to cancel all subscriptions.
		off: function (eventsStr, fn) {
			if (eventsStr) {
				eventsStr.split(' ').forEach(function(event) {
					if (fn) {
						var fnIndex = this.subscribers[event].indexOf(fn);
						if (fnIndex >= 0) this.subscribers[event].splice(fnIndex, 1);
					} else {
						this.subscribers[event] = [];
					}
				}, this);
			} else {
				for (var event in this.subscribers) {
					this.subscribers[event] = [];
				}
			}
			return this;
		},

		// Notify all the subscribers of an event
		trigger: function(event) {
			var args = arguments;
			var t = this;
			function caller(fn) {
				fn.apply(t, args);
			}
			(this.subscribers[event] || []).forEach(caller);
			if (event !== 'any') (this.subscribers.any || []).forEach(caller);
			return this;
		}
	};

	return Subscribable;
});
