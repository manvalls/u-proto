var Su = require('u-su'),
    
    prefix = module.exports = Su();

Su.define(Object.prototype,prefix,function(prop){
  
  if(this[prop]) return this[prop];
  
  prop = prop.charAt(0).toUpperCase() + prop.slice(1);
  
  return  this['webkit' + prop]   ||
          this['moz' + prop]      ||
          this['ms' + prop]       ||
          this['o' + prop];
});

