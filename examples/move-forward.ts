import { Go1, Go1Mode } from "../src/go1";

let dog = new Go1();
dog.init();
dog.setMode(Go1Mode.walk);
dog.goForward(0.25, 2000);
//dog.go(0, -0.25, -0.25, 1000);
