module.exports = require('u-su')();
require('./until/EventEmitter.js');
if(global.EventTarget) require('./until/EventTarget.js');
