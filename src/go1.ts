import { Go1MQTT } from "./go1-mqtt";

export class Go1 {
  mqtt: Go1MQTT;

  constructor() {
    console.log("go1 constructor");
    this.mqtt = new Go1MQTT();
    this.mqtt.connect();
  }

  goForward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  goBackward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed * -1.0);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  goLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed * -1, 0, 0);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  goRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed, 0, 0);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  turnLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed * -1, 0);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  turnRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed, 0);
    await this.mqtt.sendCommand(lengthOfTime);
  };

  wait = (lengthOfTime: number) => {
    return new Promise((resolve) => setTimeout(resolve, lengthOfTime));
  };
}
