var Su = require('u-su'),
    define = module.exports = Su();

Su.define(Object.prototype,define,function(obj,desc){
  var keys,i,j,bag;
  
  bag = {};
  desc = desc || {};
  keys = Object.keys(obj);
  
  for(j = 0;j < keys.length;j++){
    i = keys[j];
    d = Object.getOwnPropertyDescriptor(obj,i);
    
    d.enumerable = desc.enumerable || false;
    d.configurable = desc.configurable || false;
    
    bag[i] = d;
  }
  
  Object.defineProperties(this,bag);
  return bag;
});

