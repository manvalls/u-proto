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
  var key,keys,d;

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
        d = getGetter(base,keys).pipe(data[key]);
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
