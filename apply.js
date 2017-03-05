var Setter = require('y-setter'),
    Getter = Setter.Getter,
    getGetter = require('./apply/getGetter'),
    define = require('./define.js'),
    apply = module.exports = Symbol(),
    getPair;

// apply

Object.prototype[define](apply,function(data,detacher){
  runApply([],this,data,detacher);
});

function runApply(baseProps,base,data,detacher){
  var key,keys,d,setter;

  for(key of Object.keys(data)){

    keys = baseProps.concat(key);

    // Nested object

    if(data[key] && data[key].constructor == Object) runApply(keys,base,data[key],detacher);

    else if(Getter.is(data[key]) || Setter.is(data[key])){

      // Getter

      if(Getter.is(data[key])){
        d = data[key].pipe(base,keys,{
          set: setData,
          base: base
        });

        if(detacher) detacher.add(d);
      }

      // Setter

      if(Setter.is(data[key])){

        if(Getter.is(data[key])) setter = {
          set: setHybrid,
          ignoredValue: undefined,
          hybrid: data[key]
        };

        d = getGetter(base,keys).bounce().pipe(data[key],null,setter);
        if(detacher) detacher.add(d);

      }

    }else recursiveSetData(base,keys,data[key]);

  }

}

if(global.CSSStyleDeclaration) getPair = require('greens/get-pair');

function recursiveSetData(obj,keys,value){
  var i;

  for(i = 0;i < keys.length - 1;i++) obj = obj[keys[i]] || {};
  setData.call({base: obj},obj,keys[i],value);
}

function setData(obj,key,value){
  var priority = '',
      different = false,
      cssDifferent = false;

  if(global.CSSStyleDeclaration && obj instanceof global.CSSStyleDeclaration){
    if(value && value instanceof Array) [value,priority] = value;
    [key,value] = getPair(key,value);

    cssDifferent = obj[key] !== value;
    obj.setProperty(key,value,priority);
  }

  different = obj[key] !== value
  if(different) obj[key] = value;
  if(different || cssDifferent) getGetter.check(this.base);

}

function normalSet(obj,key,value){
  if(value === undefined){
    this.set = setHybrid;
    this.ignoredValue = undefined;
  }else if(obj[key] !== value) obj[key] = value;
}

function setHybrid(obj,key,value){
  this.set = normalSet;
  this.ignoredValue = {};

  if(this.hybrid.value !== value){
    if(this.hybrid.value !== undefined) this.hybrid.update();
    else this.hybrid.value = value;
  }
}
