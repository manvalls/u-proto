var t = require('u-test'),
    assert = require('assert'),
    define = require('../define.js');

t('define',function(){

  t('Bag',function(){

    t('Defaults',function(){
      var obj = {},
          s = Symbol();

      obj[define]({
        foo: 'bar',
        [s]: obj
      });

      obj.foo = 'foo';
      delete obj[s];

      assert.strictEqual(obj.foo,'bar');
      assert.strictEqual(obj[s],obj);
    });

    t('Configurable and writable',function(){
      var obj = {},
          s = Symbol();

      obj[define]({
        foo: 'bar',
        [s]: obj
      },{writable: true, configurable: true});

      obj.foo = 'foo';
      delete obj[s];

      assert.strictEqual(obj.foo,'foo');
      assert.strictEqual(obj[s],undefined);
    });

  });

  t('Single property',function(){

    t('Defaults',function(){
      var obj = {},
          s = Symbol();

      obj[define]('foo','bar');
      obj[define](s,obj);

      obj.foo = 'foo';
      delete obj[s];

      assert.strictEqual(obj.foo,'bar');
      assert.strictEqual(obj[s],obj);
    });

    t('Configurable and writable',function(){
      var obj = {},
          s = Symbol();

      obj[define]('foo','bar',{writable: true, configurable: true});
      obj[define](s,obj,{writable: true, configurable: true});

      obj.foo = 'foo';
      delete obj[s];

      assert.strictEqual(obj.foo,'foo');
      assert.strictEqual(obj[s],undefined);
    });

  });

});
