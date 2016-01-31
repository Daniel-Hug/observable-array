
// Setup
var Subscribable = require('./subscribable.js');
var test = {};

/*
	Tests
*/

// export
test['was Subscribable exported'] = typeof Subscribable === 'function';

// properties of Subscribable.prototype exist
test['Subscribable.prototype.on exists'] = typeof Subscribable.prototype.on === 'function';
test['Subscribable.prototype.off exists'] = typeof Subscribable.prototype.off === 'function';
test['Subscribable.prototype.trigger exists'] = typeof Subscribable.prototype.trigger === 'function';

// on / trigger
var s = new Subscribable();
var timesFired = 0;
var hasFailed = false;
s.on('made up events rock', function() {
	timesFired++;
});
if (timesFired !== 0) hasFailed = true;
s.trigger('made');
if (timesFired !== 1) hasFailed = true;
s.trigger('up');
if (timesFired !== 2) hasFailed = true;
s.trigger('events');
if (timesFired !== 3) hasFailed = true;
test['on / trigger'] = !hasFailed;

// s.off('two events')
timesFired = 0;
s.off('made events');
s.trigger('made');
s.trigger('events');
test['s.off(\'two events\')'] = timesFired === 0;

// s.off()
timesFired = 0;
s.off();
s.trigger('up');
s.trigger('rock');
test['s.off()'] = timesFired === 0;


// Closing message:
var stat = {
	complete: 0,
	pass: 0,
	fail: 0
};
for (var testName in test) {
	stat.complete++;
	stat[test[testName] ? 'pass' : 'fail']++;
	if (!test[testName]) console.log('test "%s" failed.', testName);
}
console.log('%d assertions completed. %d passed, and %d failed.', stat.complete, stat.pass, stat.fail);