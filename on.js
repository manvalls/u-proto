var Su = require('u-su'),
    walk = require('y-walk'),
    
    until = require('./until.js'),
    
    active = Su(),
    on = Su();

module.exports = on;

function Cbc(){
  this[active] = true;
}

Object.defineProperty(Cbc.prototype,'detach',{value: function(){
  this[active] = false;
}});

function* callOn(cbc,args,event,listener){
  
  args[0] = yield this[until](event);
  while(cbc[active]){
    walk(listener,args,this);
    args[0] = yield this[until](event);
  }
  
}

Su.define(Object.prototype,on,function(){
  var event = arguments[0],
      listener = arguments[1],
      cbc = new Cbc();
  
  arguments[1] = cbc;
  walk(callOn,[cbc,arguments,event,listener],this);
  
  return cbc;
});

