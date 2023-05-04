import { EventEmitter } from "events";
import { Go1MQTT } from "./mqtt/go1-mqtt";
import { Go1State, getGo1StateCopy } from "./mqtt/go1-state";
import { IClientOptions } from "mqtt";

export enum Go1Mode {
  dance1 = "dance1",
  dance2 = "dance2",
  straightHand1 = "straightHand1",
  damping = "damping",
  standUp = "standUp",
  standDown = "standDown",
  recoverStand = "recoverStand",
  stand = "stand",
  walk = "walk",
  run = "run",
  climb = "climb",
}

export class Go1 extends EventEmitter {
  mqtt: Go1MQTT;
  go1State: Go1State;

  constructor(iClientOptions?: IClientOptions) {
    super();
    this.mqtt = new Go1MQTT(this, iClientOptions);
    this.go1State = getGo1StateCopy();
  }

  init = () => {
    this.mqtt.connect();
    this.mqtt.subscribe();
  };
  /**
   *
   * @param state
   */
  publishState = (state: Go1State) => {
    this.emit("go1StateChange", state);
  };

  /**
   *
   * @param connected
   */
  publishConnectionStatus = (connected: boolean) => {
    this.emit("go1ConnectionStatus", connected);
  };

  /**
   * Move forward based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goForward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, 0, speed);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move backward based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goBackward = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, 0, speed * -1.0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move left based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed * -1, 0, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Move right based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  goRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed, 0, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   *
   * Go left/right, turn left/right, and go forward/backward based on speed and time
   *
   * @param leftRightSpeed - A value from -1 to 1
   * @param turnLeftRightSpeed - A value from -1 to 1
   * @param backwardForwardSpeed - A value from -1 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  go = async (
    leftRightSpeed: number,
    turnLeftRightSpeed: number,
    backwardForwardSpeed: number,
    lengthOfTime: number
  ) => {
    this.mqtt.updateSpeed(
      leftRightSpeed,
      turnLeftRightSpeed,
      0,
      backwardForwardSpeed
    );
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Rotate left based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  turnLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed * -1, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Rotate right based on speed and time
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  turnRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Raw pose method for accessing all of the axes together. Requires stand mode to be set first.
   *
   * @param leanLeftRightAmount - A value from -1 to 1
   * @param twistLeftRightAmount - A value from -1 to 1
   * @param lookUpDownAmount - A value from -1 to 1 (only for stand mode)
   * @param extendSquatAmount - A value from -1 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  pose = async (
    leanLeftRightAmount: number,
    twistLeftRightAmount: number,
    lookUpDownAmount: number,
    extendSquatAmount: number,
    lengthOfTime: number
  ) => {
    this.mqtt.updateSpeed(
      leanLeftRightAmount,
      twistLeftRightAmount,
      lookUpDownAmount,
      extendSquatAmount
    );
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Extend up - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  extendUp = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, 0, speed);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Squat up - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  squatDown = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, 0, speed * -1);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Leans body to the left - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  leanLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed * -1, 0, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Leans body to the right - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  leanRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(speed, 0, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Twists body to the left - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  twistLeft = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed * -1, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Twists body to the right - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  twistRight = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, speed, 0, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Leans body down - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  lookDown = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Leans body up - requires setMode(Go1Mode.stand) to be set
   *
   * @param speed - A value from 0 to 1
   * @param lengthOfTime - Length of time for movement in milliseconds
   */
  lookUp = async (speed: number, lengthOfTime: number) => {
    this.mqtt.updateSpeed(0, 0, speed * -1, 0);
    await this.mqtt.sendMovementCommand(lengthOfTime);
  };

  /**
   * Helper function to clear out previous queued movements
   */
  resetBody = async () => {
    this.mqtt.updateSpeed(0, 0, 0, 0);
    await this.mqtt.sendMovementCommand(1000);
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

  /**
   * Set Go1's operation mode
   *
   * @param mode
   * Go1Mode.dance1
   * Go1Mode.dance2
   * Go1Mode.straightHand1
   * Go1Mode.damping
   * Go1Mode.standUp,
   * Go1Mode.standDown
   * Go1Mode.recoverStand
   * Go1Mode.stand
   * Go1Mode.walk
   * Go1Mode.run
   * Go1Mode.climb
   */
  setMode = (mode: Go1Mode) => {
    this.mqtt.sendModeCommand(mode);
  };
}

/**
 * stand
 * 0, 0, 0, 1 = stand tall (W)
 * 0, 0, 0, -1 = stand short (S)
 *
 * -1, 0, 0, 0 - tilt left (A)
 * 1, 0, 0, 0 - tilt right (D)
 *
 * 0, -1, 0, 0 - look left (left arrow)
 * 0, 1, 0, 0 - look right (right arrow)
 *
 * 0, 0, -1, 0 - look down (up arrow)
 * 0, 0, 1, 0 - look up (down arrow)
 */
