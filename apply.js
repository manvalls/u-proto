var Setter = require('y-setter'),
    Getter = Setter.Getter,
    detacher = require('u-elem/detacher'),

    define = require('./define.js'),
    apply = module.exports = Symbol(),
    setters = Symbol(),
    connections = Symbol(),
    observer = Symbol(),
    captureHandler = Symbol(),

    events = ['input','change','scroll'],
    globalEvents = ['resize'],

    getPair,cssAssign,watcher;

Object.prototype[define](apply,function(data,c){
  var keys = Object.keys(data),
      i,j,conn,
      aD,dD;

  for(j = 0;j < keys.length;j++){
    i = keys[j];

    if(data[i] && data[i].constructor == Object && typeof this[i] == 'object'){
      this[i][apply](data[i],c);
      continue;
    }

    if(this[setters] && this[setters].has(i)){

      this[setters].delete(i);

      if(!this[setters].size){
        dD = !this[connections];
        delete this[setters];
        detach(this);
      }

    }

    if(this[connections] && this[connections].has(i)){

      this[connections].get(i).detach();
      this[connections].delete(i);

      if(!this[connections].size){
        dD = !this[setters];
        delete this[connections];
      }

    }

    if(dD && this.removeEventListener) this[detacher].listen(onDestruction,[],this);

    if(Setter.is(data[i])){

      if(Getter.is(this[i])){

        conn = this[i].connect(data[i]);
        if(c) c.add(conn);

        if(!this[connections]){
          this[connections] = new Map();
          aD = !this[setters];
        }

        this[connections].set(i,conn);

      }else if(this.addEventListener){

        if(!this[setters]){
          this[setters] = new Map();
          aD = !this[connections];
          attach(this);
        }

        this[setters].set(i,data[i]);

      }

    }

    if(Getter.is(data[i])){
      if(Setter.is(this[i])) conn = data[i].connect(this[i]);
      else conn = data[i].connect(this,i);

      if(c) c.add(conn);
      if(!this[connections]){
        this[connections] = new Map();
        aD = aD || !this[setters];
      }

      this[connections].set(i,conn);
    }

    if(aD && this.addEventListener) this[detacher].listen(onDestruction,[],this);
    if(Getter.is(data[i]) || Setter.is(data[i])) continue;

    if(Setter.is(this[i])) this[i].value = data[i];
    else this[i] = data[i];

  }

  return this;
});

function onDestruction(){
  var conn;

  if(this[setters]){
    delete this[setters];
    detach(this);
  }

  if(this[connections]){
    for(conn of this[connections].values()) conn.detach();
    delete this[connections];
  }

}

function listener(){
  var s = this.that[setters];
  digest(s,this.that);
  setTimeout(digest,50,s,this.that);
}

function digest(s,that){
  var e;
  if(that[setters] != s) return;
  for(e of s.entries()) e[1].value = that[e[0]];
}

function attach(that){
  var i,bind;

  that[captureHandler] = {
    handleEvent: listener,
    that: that
  };

  for(i = 0;i < events.length;i++) that.addEventListener(events[i],that[captureHandler],true);
  if(global.addEventListener) for(i = 0;i < globalEvents.length;i++) global.addEventListener(globalEvents[i],that[captureHandler],true);

  if(global.MutationObserver && that instanceof global.Node){
    bind = bind || listener.bind({that: that});
    that[observer] = new MutationObserver(bind);

    that[observer].observe(that,{
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });

  }

}

function detach(that){
  var i;

  for(i = 0;i < events.length;i++) that.removeEventListener(events[i],that[captureHandler],true);
  if(global.removeEventListener) for(i = 0;i < globalEvents.length;i++) global.removeEventListener(globalEvents[i],that[captureHandler],true);

  if(that[observer]){
    that[observer].disconnect();
    delete that[observer];
  }

}

if(global.CSSStyleDeclaration){

  getPair = require('u-css/get-pair');

  CSSStyleDeclaration.prototype[define](apply,function(data,c){
    var keys = Object.keys(data),
        i,j,conn;

    for(j = 0;j < keys.length;j++){
      i = keys[j];

      if(this[connections] && this[connections].has(i)){
        this[connections].get(i).detach();
        this[connections].delete(i);
        if(!this[connections].size) delete this[connections];
      }

      if(!data[i]){
        cssAssign(this,i,data[i]);
        continue;
      }

      if(Getter.is(data[i])){
        conn = data[i].watch(watcher,this,i);
        if(c) c.add(conn);

        this[connections] = this[connections] || new Map();
        this[connections].set(i,conn);
        continue;
      }

      cssAssign(this,i,data[i]);
    }

    return this;
  });

  cssAssign = function(obj,k,v){
    [k,v] = getPair(k,v);
    obj[k] = v;
  };

  watcher = function(v,ov,d,obj,k){
    cssAssign(obj,k,v);
  };

}
