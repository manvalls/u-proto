var Su = require('u-su'),
    define = module.exports = Su();

Su.define(Object.prototype,define,function(obj,desc){
  var keys,i,j,bag;
  
  if(typeof obj == 'string'){
    bag = {};
    bag[obj] = {};
    
    bag[obj].value = desc;
    desc = arguments[2] || {};
    
    bag[obj].enumerable = desc.enumerable || false;
    bag[obj].configurable = desc.configurable || false;
    bag[obj].writable = desc.writable || false;
    
    Object.defineProperties(this,bag);
    return bag;
  }
  
  bag = {};
  desc = desc || {};
  keys = Object.keys(obj);
  
  for(j = 0;j < keys.length;j++){
    i = keys[j];
    d = Object.getOwnPropertyDescriptor(obj,i);
    
    d.enumerable = desc.enumerable || false;
    d.configurable = desc.configurable || false;
    if('writable' in d) d.writable = desc.writable || false;
    
    bag[i] = d;
  }
  
  Object.defineProperties(this,bag);
  return bag;
});

