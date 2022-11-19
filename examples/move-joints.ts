import { Go1, Go1Mode } from "../src/go1";

let dog = new Go1();
dog.setMode(Go1Mode.stand);

async function run() {
  for (let i = 0; i < 2; i++) {
    console.log("extend up");
    await dog.extendUp(1, 2000);
    console.log("squat down");
    await dog.squatDown(1, 2000);
  }
  console.log("done!");
}

run();
