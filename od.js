var Su = require('u-su'),
    walk = require('y-walk'),
    
    until = require('./until.js'),
    
    active = Su();

exports.on = Su();
exports.once = Su();
exports.detach = Su();

Su.define(Object.prototype,exports.on,walk.wrap(function*(event,listener,extra){
  var e;
  
  listener[active] = listener[active] || {};
  listener[active][event] = true;
  
  e = yield this[until](event);
  while(listener[active][event]){
    walk(listener,[e,extra],this);
    e = yield this[until](event);
  }
  
}));

Su.define(Object.prototype,exports.once,walk.wrap(function*(event,listener,extra){
  var e;
  
  listener[active] = listener[active] || {};
  listener[active][event] = true;
  
  e = yield this[until](event);
  if(listener[active][event]) walk(listener,[e,extra],this);
  
}));

Su.define(Object.prototype,exports.detach,function(event,listener){
  if(!(listener[active] && listener[active][event])) return;
  listener[active][event] = false;
});

