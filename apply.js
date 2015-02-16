var Su = require('u-su'),
    apply = module.exports = Su();

Su.define(Object.prototype,apply,function(data){
  var keys = Object.keys(data),
      i;
  
  for(i = 0;i < keys.length;i++) this[keys[i]] = data[keys[i]];
  
  return this;
});

