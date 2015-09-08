var t = require('u-test'),
    assert = require('assert'),
    prefix = require('../prefix.js');

t('prefix',function(){
  var obj = {
        webkitEcho: function(v){ return v; },
        foo: function(){ return 'bar'; },
        mozBar: 'foo',
        msBoo: 'foo',
        oBo: 'foo'
      };

  assert.strictEqual(
    obj[prefix]('echo',['hi']),
    'hi'
  );

  assert.strictEqual(
    obj[prefix]('foo'),
    obj.foo
  );

  assert.strictEqual(
    obj[prefix]('foo',[]),
    'bar'
  );

  assert.strictEqual(
    obj[prefix]('bar'),
    'foo'
  );

  assert.strictEqual(
    obj[prefix]('boo'),
    'foo'
  );

  assert.strictEqual(
    obj[prefix]('bo'),
    'foo'
  );
  
});
