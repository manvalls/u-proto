Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var t = require('u-test'),
    assert = require('assert'),
    wait = require('y-timers/wait'),

    Setter = require('y-setter'),
    Getter = Setter.Getter,
    Hybrid = Setter.Hybrid,

    Collection = require('detacher/collection'),
    apply = require('../apply.js');

t('apply',function(){

  t('Plain object',function(){

    t('Simple',function(){
      var obj = {};

      obj[apply]({foo: 'bar'});
      assert.strictEqual(obj.foo,'bar');

      obj[apply]({foo: null});
      assert.strictEqual(obj.foo,null);
    });

    t('Nested',function(){
      var obj = {};

      obj[apply]({self: obj});
      assert.strictEqual(obj.self,obj);

      obj[apply]({self: {foo: 'bar'}});
      assert.strictEqual(obj.foo,'bar');
    });

    t('Using a getter',function(){
      var obj = {},
          s = new Setter(),
          g = s.getter,
          c = new Collection();

      s.value = 'bar';
      obj[apply]({foo: g},c);
      assert.strictEqual(obj.foo,'bar');

      s.value = 1;
      assert.strictEqual(obj.foo,1);

      c.detach();
      s.value = 2;
      assert.strictEqual(obj.foo,1);

      s.value = 'bar';
      obj[apply]({foo: g});
      assert.strictEqual(obj.foo,'bar');

      s.value = 1;
      assert.strictEqual(obj.foo,1);
    });

  });

  t('HTMLInputElement',function*(){
    var i = document.createElement('input'),
        h = new Hybrid(),
        h2 = new Hybrid(),
        c = new Collection();

    i.type = 'checkbox';
    h.value = false;

    i[apply]({checked: h});
    assert.strictEqual(i.checked,false);

    i.click();
    yield wait(10);

    assert.strictEqual(i.checked,true);
    h.value = false;
    assert.strictEqual(i.checked,false);

    h2.value = false;
    i[apply]({checked: h2},c);
    assert.strictEqual(i.checked,false);

    h.value = true;
    assert.strictEqual(i.checked,false);

    h2.value = true;
    assert.strictEqual(i.checked,true);

    i.click();
    yield wait(10);

    assert.strictEqual(i.checked,false);
    assert.strictEqual(h.value,true);
    assert.strictEqual(h2.value,false);

    c.detach();
    h2.value = true;
    assert.strictEqual(i.checked,false);

  });

  t('CSSStyleDeclaration',function(){
    var div = document.createElement('div'),
        h = new Hybrid(),
        h2 = new Hybrid(),
        c = new Collection();

    h.value = 'black';

    div[apply]({style: {color: h}});

    assert.strictEqual(div.style.color,'black');
    h.value = 'red';
    assert.strictEqual(div.style.color,'red');

    h2.value = 'black';
    div[apply]({style: {color: h2}},c);
    assert.strictEqual(div.style.color,'black');

    h.value = 'green';
    assert.strictEqual(div.style.color,'black');

    h2.value = 'red';
    assert.strictEqual(div.style.color,'red');

    c.detach();
    h2.value = 'black';
    assert.strictEqual(div.style.color,'red');

    div[apply]({style: {color: null}});
    assert(!div.style.color);

    div[apply]({style: {color: 'black'}});
    assert.strictEqual(div.style.color,'black');
  });

});
