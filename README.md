# proto

## Sample usage

```javascript
var walk = require('u-proto/walk'),
    until = require('u-proto/until'),
    EventEmitter = require('events').EventEmitter,
    
    emitter = new EventEmitter();

emitter[walk](function*(){
  yield this[until]('event');
  console.log('event');
});

emitter.emit('event'); // event
```
