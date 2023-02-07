import { Go1 } from "../src/go1";

async function run() {
  let dog = new Go1();

  while (true) {
    const go1State = dog.getState();
    console.log(go1State.bms.soc);
    console.log(go1State.robot.distanceWarning);
    await dog.wait(500);
  }
}

run();
