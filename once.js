var Su = require('u-su'),
    walk = require('y-walk'),
    
    until = require('./until.js'),
    
    active = Su(),
    once = Su();

module.exports = once;

function Cbc(){
  this[active] = true;
}

Object.defineProperties(Cbc.prototype,'detach',{value: function(){
  this[active] = false;
}});

function* callOnce(cbc,args,event,listener){
  
  args[0] = yield this[until](event);
  if(cbc[active]) walk(listener,args,this);
  
}

Su.define(Object.prototype,once,function(){
  var event = arguments[0],
      listener = arguments[1],
      cbc = new Cbc();
  
  arguments[1] = cbc;
  walk(callOnce,[cbc,arguments,event,listener]);
  
  return cbc;
});

