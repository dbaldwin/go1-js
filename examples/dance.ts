import { Go1, Go1Mode } from "../src/go1";

let dog: Go1;

async function main() {
  dog = new Go1();
  dog.init();

  await dog.wait(3000);

  dog.setMode(Go1Mode.stand);

  await dog.wait(1000);

  await dog.lookUp(0.5, 1000);
  await dog.lookDown(0.5, 1000);
  await dog.leanLeft(0.5, 1000);
  await dog.leanRight(0.5, 1000);
  await dog.twistLeft(0.5, 1000);
  await dog.twistRight(0.5, 1000);

  await dog.resetBody();

  await dog.lookUp(1, 1000);
  await dog.lookDown(1, 1000);
  await dog.leanLeft(1, 1000);
  await dog.leanRight(1, 1000);
  await dog.twistLeft(1, 1000);
  await dog.twistRight(1, 1000);

  await dog.resetBody();

  dog.setMode(Go1Mode.walk);

  console.log("done");
}

main();
