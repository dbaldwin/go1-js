import { Go1 } from "./go1";

const start = async () => {
  let dog = new Go1();
  await dog.goForward(0.25, 1000);
  await dog.goRight(0.25, 1000);
  await dog.goBackward(0.25, 1000);
  await dog.goLeft(0.25, 1000);
  await dog.wait(3000);
  await dog.turnLeft(0.25, 5000);
  await dog.turnRight(0.25, 5000);
  console.log("done");
  return;
};

start();
