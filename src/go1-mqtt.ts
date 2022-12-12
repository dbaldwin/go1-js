import * as mqtt from "mqtt";
import { Go1Mode } from "./go1";

export class Go1MQTT {
  client: mqtt.MqttClient | null;
  floats: Float32Array = new Float32Array(4);
  endpoint: string = "mqtt://192.168.12.1";
  connected: boolean = false;
  movementTopic: string;
  ledTopic: string;
  modeTopic: string;
  publishFrequency: number;

  constructor() {
    this.client = null;
    this.floats[0] = 0; // walk left (neg) and right (pos)
    this.floats[1] = 0; // turn left (neg) and  right (pos)
    this.floats[2] = 0;
    this.floats[3] = 0; // walk backward (neg) and forward (pos)
    this.movementTopic = "controller/stick";
    this.ledTopic = "programming/code";
    this.modeTopic = "controller/action";
    this.publishFrequency = 100; // Send MQTT message every 100ms
  }

  connect = () => {
    console.log("connecting");

    this.client = mqtt.connect(this.endpoint, {
      clientId: Math.random().toString(16).substring(2, 8),
      keepalive: 5,
    });

    this.client.on("connect", () => {
      console.log("connected");
      this.connected = true;
    });
  };

  updateSpeed = (
    leftRight: number,
    turnLeftRight: number,
    lookUpDown: number, // Only for stand mode
    backwardForward: number
  ) => {
    this.floats[0] = this.clamp(leftRight);
    this.floats[1] = this.clamp(turnLeftRight);
    this.floats[2] = this.clamp(lookUpDown);
    this.floats[3] = this.clamp(backwardForward);
  };

  sendMovementCommand = async (lengthOfTime: number) => {
    let interval: ReturnType<typeof setInterval>;

    let zero: Float32Array = new Float32Array(4);
    zero[0] = 0;
    zero[1] = 0;
    zero[2] = 0;
    zero[3] = 0;

    // Reset speed from the buffer for a few
    this.client?.publish(
      this.movementTopic,
      new Uint8Array(zero.buffer) as Buffer,
      {
        qos: 0,
      }
    );

    interval = setInterval(() => {
      console.log(`sending command ${this.floats}`);
      this.client?.publish(
        this.movementTopic,
        new Uint8Array(this.floats.buffer) as Buffer,
        {
          qos: 0,
        }
      );
    }, this.publishFrequency);

    // Stop sending after lengthOfTime
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        clearInterval(interval);
      }, lengthOfTime);
    });
  };

  sendLEDCommand = (r: number, g: number, b: number) => {
    this.client?.publish(
      this.ledTopic,
      `child_conn.send('change_light(${r},${g},${b})')`,
      {
        qos: 0,
      }
    );
  };

  sendModeCommand = (mode: Go1Mode) => {
    this.client?.publish(this.modeTopic, mode, {
      qos: 1,
    });
  };

  clamp = (speed: number) => {
    if (speed < -1.0) {
      return -1.0;
    } else if (speed > 1.0) {
      return 1.0;
    } else {
      return speed;
    }
  };
}
