import { Go1, Go1Mode } from "../src/go1";

let dog = new Go1();
dog.init();
dog.setMode(Go1Mode.stand);

async function run() {
  // Use direct methods for pose
  for (let i = 0; i < 2; i++) {
    console.log("extend up");
    await dog.extendUp(1, 2000);
    console.log("squat down");
    await dog.squatDown(1, 2000);
  }

  // Use generic pose method
  await dog.pose(-1, 0, 0, 0, 2000); // Lean left
  await dog.pose(1, 0, 0, 0, 2000); // Lean right
  await dog.resetBody();
  await dog.pose(0, -1, 0, 0, 2000); // Twist left
  await dog.pose(0, 1, 0, 0, 2000); // Twist right
  await dog.resetBody();
  await dog.pose(0, 0, -1, 0, 2000); // Look up
  await dog.pose(0, 0, 1, 0, 2000); // Look down
  await dog.resetBody();
  await dog.pose(0, 0, 0, -1, 2000); // Squat down
  await dog.pose(0, 0, 0, 1, 2000); // Extend up
}

run();
