import { Go1, Go1Mode } from "../src/go1";

let dog = new Go1();
dog.setMode(Go1Mode.walk);
dog.goForward(0.25, 2000);
