var Su = require('u-su'),
    getKey,
    
    apply = module.exports = Su();

Su.define(Object.prototype,apply,function(data){
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
  
  Su.define(CSSStyleDeclaration.prototype,apply,function(obj){
    var keys = Object.keys(obj),
        i,j,k;
    
    for(j = 0;j < keys.length;j++){
      i = getKey(k = keys[j]);
      if(!i) continue;
      
      this[i] = obj[k];
    }
    
    return this;
  });
  
}

