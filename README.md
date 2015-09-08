# proto  [![Build Status][travis-img]][travis-url] [![Coverage Status][cover-img]][cover-url]

## Sample usage

```javascript
var apply = require('u-proto/apply'),
    define = require('u-proto/define'),
    obj = {};

obj[apply]({foo: 'bar'});
console.log(obj.foo); // bar

obj[define]({
  one: 'two'
});

obj.one = 'three';
console.log(obj.one); // two
```

[travis-img]: https://travis-ci.org/manvalls/u-proto.svg?branch=master
[travis-url]: https://travis-ci.org/manvalls/u-proto
[cover-img]: https://coveralls.io/repos/manvalls/u-proto/badge.svg?branch=master&service=github
[cover-url]: https://coveralls.io/github/manvalls/u-proto?branch=master
