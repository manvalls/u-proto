var define = module.exports = Symbol();

Object.defineProperty(Object.prototype,define,{value: function(obj,desc){
  var keys,i,j,d,bag;

  if(typeof obj != 'object'){
    bag = Object.create(null);
    bag[obj] = {};

    bag[obj].value = desc;
    desc = arguments[2] || {};

    bag[obj].enumerable = desc.enumerable || false;
    bag[obj].configurable = desc.configurable || false;
    bag[obj].writable = desc.writable || false;

    try{ Object.defineProperty(this,obj,bag[obj]); }
    catch(e){ }

    return bag;
  }

  bag = Object.create(null);
  desc = desc || {};
  keys = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));

  for(j = 0;j < keys.length;j++){
    i = keys[j];
    d = Object.getOwnPropertyDescriptor(obj,i);

    d.enumerable = desc.enumerable || false;
    d.configurable = desc.configurable || false;
    if('writable' in d) d.writable = desc.writable || false;

    try{ Object.defineProperty(this,i,d); }
    catch(e){ }
    
    bag[i] = d;
  }

  return bag;
}});
