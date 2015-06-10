var elem = require('u-elem'),
    Su = require('u-su'),
    
    connect = require('./connect.js'),
    mirror;

module.exports = mirror = Su();

Su.define(Object.prototype,mirror,function(arr,prop,f,that){
  var obj;
  
  console.log(arr);
  
  if(!(arr instanceof Array)){
    
    obj = document.createTextNode('');
    
    that = f;
    f = prop;
    prop = arr;
    
  }else obj = elem(arr);
  
  console.log(arr);
  
  obj.connection = this[connect](obj,prop,f,that);
  
  return obj;
});

