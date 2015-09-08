Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var t = require('u-test'),
    assert = require('assert'),
    apply = require('../apply.js');

t('apply',function(){

  t('Plain object',function(){

    t('Simple',function(){
      var obj = {};

      obj[apply]({foo: 'bar'});
      assert.strictEqual(obj.foo,'bar');
    });

    t('Nested',function(){
      var obj = {};

      obj[apply]({self: obj});
      assert.strictEqual(obj.self,obj);

      obj[apply]({self: {foo: 'bar'}});
      assert.strictEqual(obj.foo,'bar');
    });

  });

  t('CSSStyleDeclaration',function(){
    var div = document.createElement('div');

    div[apply]({style: {color: 'black'}});
    assert.strictEqual(div.style.color,'black');
  });

});
