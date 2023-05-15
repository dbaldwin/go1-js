# go1-js

## Node JS Library for Unitree Go1

### Note: users upgrading to version 0.1.4 or newer you must initialize Go1 like the following:

```
let dog = new Go1();
dog.init(); // version 0.1.4+ requirement
dog.setMode(Go1Mode.walk);
dog.goForward(0.25, 2000);
```

Take a look at the examples directory for more details.
