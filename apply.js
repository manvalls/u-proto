var Su = require('u-su'),
    apply = module.exports = Su();

Su.define(Object.prototype,apply,function(data){
  var keys = Object.keys(data),
      i,j;
  
  for(j = 0;j < keys.length;j++){
    i = keys[j];
    
    if( this[i] && this[i].constructor == Object &&
        data[i] && data[i].constructor == Object ) this[i][apply](data[i]);
    else this[i] = data[i];
  }
  
  return this;
});

