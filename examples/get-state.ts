import { Go1, Go1Mode } from "../src/go1";
import { Go1State } from "../src/mqtt/go1-state";

let dog: Go1;

function handleBattery(state: Go1State): void {
  const batt: number = state.bms.soc;

  console.log(`battery is at ${batt}%`);

  if (batt >= 75) {
    dog.setLedColor(0, 255, 0); // green
  } else if (batt >= 50 && batt < 75) {
    dog.setLedColor(255, 127, 0); // orange
  } else if (batt < 25) {
    dog.setLedColor(255, 0, 0); // red
  }
}

async function main() {
  dog = new Go1();

  dog.on("go1StateChange", (state) => {
    handleBattery(state);
  });

  // Normally you would navigate Go1 around
  // this infinite loop is just to demonstrate
  // the battery handler above
  while (true) {
    dog.setMode(Go1Mode.standDown);
    await dog.wait(2000);
    dog.setMode(Go1Mode.standUp);
    await dog.wait(2000);
  }
}

main();
