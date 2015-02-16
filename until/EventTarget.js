var Su = require('u-su'),
    Resolver = require('y-resolver'),
    
    until = require('../until.js'),
    resolvers = Su();

function callback(e){
  var resolver = this[resolvers][e.type];
  
  delete this[resolvers][e.type];
  this.removeEventListener(e.type,callback,false);
  resolver.accept(e);
}

Su.define(EventTarget.prototype,until,function(event){
  var resolver;
  
  this[resolvers] = this[resolvers] || {};
  
  if(resolver = this[resolvers][event]) return resolver.yielded;
  
  this.addEventListener(event,callback,false);
  
  return (this[resolvers][event] = resolver = new Resolver()).yielded;
});

