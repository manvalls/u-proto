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
    document.body.appendChild(i);

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

    i[apply]({checked: h2, h: h});
    assert.strictEqual(i.checked,true);
    assert.strictEqual(i.h,true);

    i.click();
    yield wait(10);

    assert.strictEqual(i.checked,false);
    assert.strictEqual(h2.value,false);
    assert.strictEqual(i.h,true);

    h.value = false;
    assert.strictEqual(i.h,false);

    i.dispatchEvent(new Event('destruction'));

    i.click();
    yield wait(10);

    assert.strictEqual(i.checked,true);
    assert.strictEqual(h2.value,false);

    h.value = true;
    assert.strictEqual(i.h,false);
  });

  t('HTMLDivElement',function*(){
    var span = document.createElement('span'),
        width = new Hybrid(),
        w1;

    span[apply]({ offsetWidth: width });
    span.textContent = 'foo';
    document.body.appendChild(span);
    yield wait(10);

    w1 = width.value;
    span.textContent += 'bar';
    yield wait(10);

    assert(width.value > w1);
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

  t('Object with setters and getters',function(){
    var setter = new Setter(),
        setter2 = new Setter(),
        col = new Collection(),
        obj = {
          setter: new Setter(),
          getter: setter.getter
        };

    obj[apply]({
      setter: 5
    });

    assert.strictEqual(obj.setter.value,5);

    obj[apply]({
      getter: setter2,
      setter: setter2.getter
    },col);

    setter.value = 'foo';
    assert.strictEqual(setter2.value,'foo');
    assert.strictEqual(obj.setter.value,'foo');
    col.detach();
    setter.value = 'bar';
    assert.strictEqual(setter2.value,'foo');

    obj[apply]({
      foo: setter
    });

    assert.strictEqual(obj.foo,'bar');
  });

});
