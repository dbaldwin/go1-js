import { Go1, Go1Mode } from "../src/go1";
import { Go1State } from "../src/mqtt/go1-state";

let dog: Go1;

function handleCollisionDetection(state: Go1State): void {
  const warningThreshold: number = 0.75;
  const frontWarning: number = state.robot.distanceWarning.front;
  const backWarning: number = state.robot.distanceWarning.back;
  const leftWarning: number = state.robot.distanceWarning.left;
  const rightWarning: number = state.robot.distanceWarning.right;

  console.log(`Current forward warning is: ${frontWarning}`);

  if (frontWarning > warningThreshold) {
    dog.setLedColor(255, 0, 0);
    dog.setMode(Go1Mode.standDown);
  }
}

async function main() {
  dog = new Go1();
  dog.init();
  dog.setLedColor(0, 255, 0);

  dog.on("go1StateChange", (state) => {
    handleCollisionDetection(state);
  });

  // Manually walk Go1 towards a wall (be careful!)
  while (true) {
    await dog.wait(500);
  }
}

main();
