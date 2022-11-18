import { Go1MQTT } from "./go1-mqtt";

export class Go1 {
  mqtt: Go1MQTT;

  constructor() {
    this.mqtt = new Go1MQTT();
    this.mqtt.connect();
  }

  goForward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  goBackward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed * -1.0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  goLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed * -1, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  goRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  turnLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed * -1, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  turnRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  wait = (lengthOfTime: number) => {
    return new Promise((resolve) => setTimeout(resolve, lengthOfTime));
  };

  setLedColor = (r: number, g: number, b: number) => {
    this.mqtt.sendLEDCommand(r, g, b);
  };
}
