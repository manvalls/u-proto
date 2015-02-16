var walk = require('y-walk'),
    Su = require('u-su'),
    
    wlk = module.exports = Su();

Su.define(Object.prototype,wlk,function(generator,args){
  return walk(generator,args,this);
});

