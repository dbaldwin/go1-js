import { Go1MQTT } from "./go1-mqtt";

export class Go1 {
  mqtt: Go1MQTT;

  constructor() {
    this.mqtt = new Go1MQTT();
    this.mqtt.connect();
  }

  /**
   * Move forward based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goForward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move backward based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goBackward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed * -1.0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move left based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed * -1, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move right based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Rotate left based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  turnLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed * -1, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Rotate right based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  turnRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Wait for a period of time
   *
   * @param lengthOfTime - Length of time for wait in milliseconds
   */
  wait = (lengthOfTime: number) => {
    return new Promise((resolve) => setTimeout(resolve, lengthOfTime));
  };

  /**
   * Change Go1's LED color
   *
   * @param r - A red value from 0 to 255
   * @param g - A green value from 0 to 255
   * @param b - A blue value from 0 to 255
   */
  setLedColor = (r: number, g: number, b: number) => {
    this.mqtt.sendLEDCommand(r, g, b);
  };
}
