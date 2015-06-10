var elem = require('u-elem'),
    Su = require('u-su'),
    
    connect = require('../connect.js'),
    mirror;

module.exports = mirror = Su();

Su.define(Object.prototype,mirror,function(arr,prop,f,that){
  var obj;
  
  if(!(arr instanceof Array)){
    
    obj = document.createTextNode('');
    
    that = f;
    f = prop;
    prop = arr;
    
  }else obj = elem(arr);
  
  obj.connection = this[connect](obj,prop,f,that);
  
  return obj;
});

