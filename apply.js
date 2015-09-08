var define = require('./define.js'),

    apply = module.exports = Symbol(),

    getKey,getValue;

Object.prototype[define](apply,function(data){
  var keys = Object.keys(data),
      i,j;

  for(j = 0;j < keys.length;j++){
    i = keys[j];

    if( typeof this[i] == 'object' &&
        data[i] && data[i].constructor == Object ) this[i][apply](data[i]);
    else this[i] = data[i];
  }

  return this;
});

if(global.CSSStyleDeclaration){
  getKey = require('u-css/get-key');
  getValue = require('u-css/get-value');

  CSSStyleDeclaration.prototype[define](apply,function(obj){
    var keys = Object.keys(obj),
        i,j,k,v;

    for(j = 0;j < keys.length;j++){
      i = getKey(k = keys[j]);
      this[i] = getValue(i,obj[k]);
    }

    return this;
  });

}
