var Resolver = require('y-resolver'),
    {Yielded} = Resolver,
    {Getter} = require('y-setter'),

    parent = Symbol(),
    path = Symbol(),
    context = Symbol(),
    contexts = Symbol();

module.exports = function(base,keys){
  return new ElementGetter(base, keys);
};

module.exports.check = function(base){
  var ctx;
  if(base[contexts]) for(ctx of base[contexts]) handleEvent.call({base,ctx});
};

class ElementGetter extends Getter{

  constructor(base, keys){
    super();

    this[context] = {};
    this[parent] = base;
    this[path] = keys;
  }

  get value(){
    var base = this[parent],
        keys = this[path],
        key;

    for(key of keys) base = (base || {})[key];
    return base;
  }

  touched(){
    var base = this[parent],
        keys = this[path],
        ctx = this[context],
        event,document,window,element,
        events,globalEvents,mutations;

    if(!canBeListened(base)) return new Yielded();
    ctx.resolver = ctx.resolver || new Resolver();
    base[contexts] = base[contexts] || new Set();
    base[contexts].add(ctx);

    if(!ctx.listeners){
      ctx.listeners = [];
      document = base.ownerDocument || {};
      window = document.defaultView || document.parentWindow || base;

      switch(keys[keys.length - 1]){

        case 'files':
        case 'value':
        case 'valueAsDate':
        case 'valueAsNumber':
        case 'selectedOptions':
        case 'selectedIndex':
          events = ['input', 'propertychange', 'change'];
          globalEvents = [];
          break;

        case 'offsetWidth':
        case 'scrollWidth':
        case 'clientWidth':
        case 'offsetHeight':
        case 'scrollHeight':
        case 'clientHeight':

          events = [];
          globalEvents = ['resize'];
          mutations = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
          };

          break;

        case 'scrollLeft':
        case 'scrollTop':
          events = ['scroll'];
          globalEvents = [];
          break;

        case 'checked':
          events = ['click','change'];
          globalEvents = [];
          break;

        case 'innerHTML':
        case 'outerHTML':
        case 'innerText':
        case 'textContent':

          events = ['input', 'propertychange', 'change'];
          globalEvents = [];
          mutations = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
          };

          break;

        case 'childElementCount':
          events = [];
          globalEvents = [];
          mutations = {childList: true};
          break;

        default:
          events = [];
          globalEvents = [];
          break;

      }

      if(keys.length > 1 && keys[0] != 'style') mutations = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      };

      element = base;
      for(event of events) attach({handleEvent,ctx,base,event,window,element});

      if(canBeListened(window)){
        element = window;
        for(event of globalEvents) attach({handleEvent,ctx,base,event,window,element});
      }

      if(mutations && global.MutationObserver && base instanceof global.Node){

        ctx.observer = new MutationObserver(mutationListener);
        ctx.observer.ctx = ctx;
        ctx.observer.base = base;
        ctx.observer.observe(base,mutations);

      }

    }

    return ctx.resolver.yielded;
  }

  frozen(){
    if(!canBeListened(this[parent])) return Resolver.accept();
    return new Yielded();
  }

}

// Utils

function canBeListened(base){
  return (typeof base.addEventListener == 'function') || (typeof base.attachEvent == 'function');
}

function attach(object){
  object.ctx.listeners.push(object);
  if(object.element.addEventListener) object.element.addEventListener(object.event,object,false);
  else object.element.attachEvent('on' + event,object.listener = event => object.handleEvent(event));
}

function detach(object){
  if(object.element.removeEventListener) object.element.removeEventListener(object.event,object,false);
  else object.element.detachEvent('on' + object.event,object.listener);
}

// Listeners

function mutationListener(mutations,obs){
  handleEvent.call(obs);
}

function handleEvent(){
  var res = this.ctx.resolver,
      listener;

  if(!res) return;
  delete this.ctx.resolver;
  res.accept();

  if(!this.ctx.resolver){
    for(listener of this.ctx.listeners) detach(listener);
    delete this.ctx.listeners;
    this.base[contexts].delete(this.ctx);

    if(this.ctx.observer){
      this.ctx.observer.disconnect();
      delete this.ctx.observer;
    }
  }

}
