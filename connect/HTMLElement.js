var Su = require('u-su'),
    connect = require('../connect.js'),
    
    that = Su(),
    funcThat = Su(),
    func = Su(),
    key = Su(),
    object = Su(),
    connections = Su();

function listener(e){
  var nv,i,obj,prop,conn,f,that;
  
  nv = this.innerHTML;
  
  for(i = 0;i < this[connections].length;i++){
    conn = this[connections][i];
    obj = conn[object];
    prop = conn[key];
    f = conn[func];
    that = conn[funcThat];
    
    if(f) obj[prop] = f.call(that,nv,obj[prop],obj);
    else obj[prop] = nv;
  }
  
}

Su.define(HTMLElement.prototype,connect,function(obj,prop,f,that){
  var conn = new Connection(this,obj,prop,f,that),
      cns;
  
  this[connections] = this[connections] || [];
  if(!this[connections].length) this.addEventListener('input',listener);
  
  this[connections].push(conn);
  
  cns = this[connections];
  this[connections] = [conn];
  try{ listener.call(this); }catch(e){}
  
  this[connections] = cns;
});

function Connection(t,obj,prop,f,ft){
  
  if(prop == null || typeof prop == 'function'){
    
    ft = f;
    f = prop;
    prop =    'value' in obj ? 'value' : 
            ( 'innerHTML' in obj ? 'innerHTML' : 'textContent');
    
  }
  
  this[object] = obj;
  this[that] = t;
  this[func] = f;
  this[funcThat] = ft;
  this[key] = prop;
  
}

Object.defineProperty(Connection.prototype,'disconnect',{value: function(){
  var i = this[that][connections].indexOf(this);
  
  this[that][connections].splice(i,1);
  if(!this[that][connections].length) this[that].removeEventListener('input',listener);
  
}});

