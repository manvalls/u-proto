var Su = require('u-su'),
    walk = require('y-walk'),
    
    until = require('./until.js'),
    
    active = Su();

exports.on = Su();
exports.once = Su();
exports.detach = Su();

Su.define(Object.prototype,exports.on,walk.wrap(function*(){
  var event = arguments[0],
      listener = arguments[1];
  
  listener[active] = listener[active] || {};
  
  if(listener[active][event] != null){
    listener[active][event] = true;
    return;
  }
  
  listener[active][event] = true;
  
  arguments[1] = event;
  arguments[0] = yield this[until](event);
  
  while(listener[active][event]){
    walk(listener,arguments,this);
    arguments[0] = yield this[until](event);
  }
  
  delete listener[active][event];
  
}));

Su.define(Object.prototype,exports.once,walk.wrap(function*(){
  var event = arguments[0],
      listener = arguments[1];
  
  listener[active] = listener[active] || {};
  
  if(listener[active][event] != null){
    listener[active][event] = true;
    return;
  }
  
  listener[active][event] = true;
  
  arguments[1] = event;
  arguments[0] = yield this[until](event);
  
  if(listener[active][event]) walk(listener,arguments,this);
  delete listener[active][event];
  
}));

Su.define(Object.prototype,exports.detach,function(event,listener){
  if(!(listener[active] && listener[active][event])) return;
  listener[active][event] = false;
});

