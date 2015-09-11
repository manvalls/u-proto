var Setter = require('y-setter'),
    Getter = Setter.Getter,

    define = require('./define.js'),
    apply = module.exports = Symbol(),
    setters = Symbol(),
    connections = Symbol(),

    events = [
      'input','change','submit','reset',
      'keydown','keyup','keypress',
      'click','mousedown','mouseup','mouseover','mouseout',
      'resize','focus','blur',
      'digestion'
    ],

    getKey,getValue,cssAssign,watcher;

Object.prototype[define](apply,function(data,c){
  var keys = Object.keys(data),
      i,j,conn;

  for(j = 0;j < keys.length;j++){
    i = keys[j];

    if(this[setters] && this[setters].has(i)){
      this[setters].delete(i);
      if(!this[setters].size){
        delete this[setters];
        detach(this);
      }
    }

    if(this[connections] && this[connections].has(i)){
      this[connections].get(i).detach();
      this[connections].delete(i);
      if(!this[connections].size) delete this[connections];
    }

    if(!data[i]){
      this[i] = data[i];
      continue;
    }

    if(typeof this[i] == 'object' && data[i].constructor == Object){
      this[i][apply](data[i],c);
      continue;
    }

    if(data[i][Setter] && this.addEventListener){

      if(!this[setters]){
        this[setters] = new Map();
        attach(this);
      }

      this[setters].set(i,data[i]);
    }

    if(data[i][Getter]){
      conn = data[i].connect(this,i);
      if(c) c.add(conn);

      this[connections] = this[connections] || new Map();
      this[connections].set(i,conn);
      continue;
    }

    if(data[i][Setter]) this[i] = data[i].value;
    else this[i] = data[i];

  }

  return this;
});

function listener(){
  var s = this[setters];
  digest(s,this);
  setTimeout(digest,0,s,this);
}

function digest(s,that){
  var e;
  for(e of s.entries()) e[1].value = that[e[0]];
}

function attach(that){
  var i;
  for(i = 0;i < events.length;i++) that.addEventListener(events[i],listener,false);
}

function detach(that){
  var i;
  for(i = 0;i < events.length;i++) that.removeEventListener(events[i],listener,false);
}

if(global.CSSStyleDeclaration){

  getKey = require('u-css/get-key');
  getValue = require('u-css/get-value');

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

      if(data[i][Getter]){
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
    var i = getKey(k);
    obj[i] = getValue(i,v);
  };

  watcher = function(v,ov,d,obj,k){
    cssAssign(obj,k,v);
  };

}
