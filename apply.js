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
      i,j,conn,
      aD,dD;

  for(j = 0;j < keys.length;j++){
    i = keys[j];

    if(this[setters] && this[setters].has(i)){

      this[setters].delete(i);

      if(!this[setters].size){
        delete this[setters];
        detach(this);
        dD = !this[connections];
      }

    }

    if(this[connections] && this[connections].has(i)){

      this[connections].get(i).detach();
      this[connections].delete(i);

      if(!this[connections].size){
        delete this[connections];
        dD = dD || !this[setters];
      }

    }

    if(dD && this.removeEventListener) this.removeEventListener('destruction',onDestruction,false);

    if(!data[i]){
      this[i] = data[i];
      continue;
    }

    if(typeof this[i] == 'object' && data[i].constructor == Object){
      this[i][apply](data[i],c);
      continue;
    }

    if(Setter.is(data[i]) && this.addEventListener){

      if(!this[setters]){
        this[setters] = new Map();
        attach(this);
        aD = !this[connections];
      }

      this[setters].set(i,data[i]);

    }

    if(Getter.is(data[i])){
      conn = data[i].connect(this,i);
      if(c) c.add(conn);

      if(!this[connections]){
        this[connections] = new Map();
        aD = aD || !this[setters];
      }

      this[connections] = this[connections] || new Map();
      this[connections].set(i,conn);

      if(aD && this.addEventListener) this.addEventListener('destruction',onDestruction,false);
      continue;
    }

    if(aD && this.addEventListener) this.addEventListener('destruction',onDestruction,false);

    if(Setter.is(data[i])) this[i] = data[i].value;
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
    var i = getKey(k);
    obj[i] = getValue(i,v);
  };

  watcher = function(v,ov,d,obj,k){
    cssAssign(obj,k,v);
  };

}
