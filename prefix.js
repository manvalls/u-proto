var define = require('./define.js'),
    prefix = module.exports = Symbol();

Object.prototype[define](prefix,function(prop,args){
  var f;

  if(f = this[prop]){
    if(args) return f.apply(this,args);
    return f;
  }

  prop = prop.charAt(0).toUpperCase() + prop.slice(1);

  f = this['webkit' + prop]   ||
      this['moz' + prop]      ||
      this['ms' + prop]       ||
      this['o' + prop];

  if(args) return f.apply(this,args);
  return f;
});
