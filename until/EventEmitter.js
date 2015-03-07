var Su = require('u-su'),
    EventEmitter = require('events').EventEmitter,
    Resolver = require('y-resolver'),
    
    until = require('../until.js'),
    resolvers = Su();

Su.define(EventEmitter.prototype,until,function(event){
  var resolver;
  
  this[resolvers] = this[resolvers] || {};
  if(resolver = this[resolvers][event]) return resolver.yielded;
  
  this.once(event,function(){
    delete this[resolvers][event];
    resolver.accept(arguments);
  });
  
  return (this[resolvers][event] = resolver = new Resolver()).yielded;
});

