var Resolver = require('y-resolver'),
    {Yielded} = Resolver,
    {Getter} = require('y-setter'),
    frame = require('y-timers/frame'),

    events = ['input','change','click','keydown','focus'],
    globalEvents = ['resize','scroll'],

    listeners = Symbol(),
    observer = Symbol(),
    resolver = Symbol();

module.exports = function(base,keys){
  return new Getter(getValue,[base,keys],getYielded,[base],{},getFrozen,[base]);
};

module.exports.check = function(base){
  if(base[resolver]) handleEvent.call({base});
};

// Getter handlers

function getYielded(base,somethingChanged){
  var event,document,window,element;

  if(!canBeListened(base)) return new Yielded();
  base[resolver] = base[resolver] || new Resolver();
  base[listeners] = base[listeners] || [];

  if(!base[listeners].length){
    document = base.ownerDocument || {};
    window = document.defaultView || document.parentWindow || base;

    element = base;
    for(event of events) attach({handleEvent,base,event,window,element});

    if(canBeListened(window)){
      element = window;
      for(event of globalEvents) attach({handleEvent,base,event,window,element});
    }

    if(global.MutationObserver && base instanceof global.Node){

      base[observer] = new MutationObserver(mutationListener);
      base[observer].base = base;
      base[observer].observe(base,{
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });

    }

  }

  if(somethingChanged && !this.frame){
    this.frame = frame();
    this.frame.listen(removeFrame,[],this);
  }

  if(this.frame) return Resolver.race([base[resolver].yielded,this.frame]);
  return base[resolver].yielded;
}

function getValue(base,keys){
  var key;
  for(key of keys) base = (base || {})[key];
  return base;
}

function getFrozen(base){
  if(!canBeListened(base)) return Resolver.accept();
  return new Yielded();
}

// Utils

function canBeListened(base){
  return (typeof base.addEventListener == 'function') || (typeof base.attachEvent == 'function');
}

function attach(object){
  object.base[listeners].push(object);
  if(object.element.addEventListener) object.element.addEventListener(object.event,object,false);
  else object.element.attachEvent('on' + event,object.listener = event => object.handleEvent(object.event));
}

function detach(object){
  if(object.element.removeEventListener) object.element.removeEventListener(object.event,object,false);
  else object.element.detachEvent('on' + object.event,object.listener);
}

// Listeners

function removeFrame(){
  delete this.frame;
}

function mutationListener(mutations,obs){
  handleEvent.call(obs);
}

function handleEvent(){
  var res = this.base[resolver],
      listener;

  delete this.base[resolver];
  res.accept();

  if(!this.base[resolver]){
    for(listener of this.base[listeners]) detach(listener);
    delete this.base[listeners];

    if(this.base[observer]){
      this.base[observer].disconnect();
      delete this.base[observer];
    }
  }

}
