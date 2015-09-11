# proto  [![Build Status][travis-img]][travis-url] [![Coverage Status][cover-img]][cover-url]

## apply

```javascript
var Setter = require('y-setter'),
    apply = require('u-proto/apply'),
    Collection = require('detacher/collection'),

    setter = new Setter(),
    getter = setter.getter,
    c = new Collection(),

    check = document.createElement('input'),
    info = document.createElement('span'),
    button = document.createElement('input');

check[apply]({
  type: 'checkbox',
  checked: setter
});

info[apply]({
  textContent: getter.to(v => v ? 'Checked' : 'Not checked'),
  style: {
    color: 'blue'
  }
},c);

button[apply]({
  type: 'button',
  value: 'Unbind',
  onclick: () => c.detach()
});

document.body.appendChild(check);
document.body.appendChild(info);
document.body.appendChild(document.createElement('br'));
document.body.appendChild(button);
```

The `apply` method copies properties from one object to another recursively. When using `y-setter`'s `Getter`s, a connection will be established. When using `Setter`s, if the object has an `addEventListener` method it will be used to update the value of the `Setter` accordingly.

`Hybrid`s can be used to maintain a double binding. Connections can be terminated by reassigning a property via `apply` or by passing a `detacher` `Collection` as the second argument, to which the connections will be added.

## define

```javascript
var define = require('u-proto/define');

function Foo(){}
Foo.prototype[define]({

  get value(){ return 'bar'; },
  set value(v){ throw new Error() },

  doNothing: function(){
    <!-- :D
  }

},{configurable: true});
```

Copies properties descriptors from an object to another, making them non-enumerable, non-writable and non-configurable by default. The second argument may be used to override those defaults.

## prefix

```javascript
var prefix = require('u-proto/prefix');

navigator[prefix]('getUserMedia',[
  {audio: true},function(){},function(){}
]);
```

Automatically guesses the correct prefix for a given property of a given object. The first argument is the name of the property and the second the list of arguments with which it will be called. If the second argument is not present, the value of the property will be returned instead.

[travis-img]: https://travis-ci.org/manvalls/u-proto.svg?branch=master
[travis-url]: https://travis-ci.org/manvalls/u-proto
[cover-img]: https://coveralls.io/repos/manvalls/u-proto/badge.svg?branch=master&service=github
[cover-url]: https://coveralls.io/github/manvalls/u-proto?branch=master
