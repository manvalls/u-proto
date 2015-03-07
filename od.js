var Su = require('u-su'),
    walk = require('y-walk'),
    
    until = require('./until.js'),
    
    active = Su();

exports.on = Su();
exports.detach = Su();

function* call(l,event,extra){
  var e;
  
  e = yield this[until](event);
  while(l[active][event]){
    walk(l,[e,extra],this);
    e = yield this[until](event);
  }
  
}

Su.define(Object.prototype,exports.on,function(event,listener,extra){
  listener[active] = listener[active] || {};
  listener[active][event] = true;
  
  walk(call,[listener,event,extra],this);
});

Su.define(Object.prototype,exports.detach,function(event,listener){
  if(!(listener[active] && listener[active][event])) return;
  listener[active][event] = false;
});

