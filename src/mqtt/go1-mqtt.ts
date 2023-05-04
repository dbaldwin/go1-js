import { connect, MqttClient, IClientOptions } from "mqtt";
import { Go1State, getGo1StateCopy } from "./go1-state";
import { Go1, Go1Mode } from "../go1";
import messageHandler from "./message-handler";

export class Go1MQTT {
  go1: Go1;
  client: MqttClient | null;
  floats: Float32Array = new Float32Array(4);
  connected: boolean = false;
  movementTopic: string;
  ledTopic: string;
  modeTopic: string;
  publishFrequency: number;
  go1State: Go1State;
  iClientOptions: IClientOptions;

  readonly defaultIClientOptions: IClientOptions = {
    port: 1883,
    host: "192.168.12.1",
    clientId: Math.random().toString(16).substring(2, 8),
    keepalive: 5,
    protocol: "mqtt",
  };

  constructor(go1: Go1, iClientOptions?: IClientOptions) {
    this.go1 = go1;
    this.iClientOptions = { ...this.defaultIClientOptions, ...iClientOptions };
    this.client = null;
    this.floats[0] = 0; // walk left (neg) and right (pos)
    this.floats[1] = 0; // turn left (neg) and  right (pos)
    this.floats[2] = 0;
    this.floats[3] = 0; // walk backward (neg) and forward (pos)
    this.movementTopic = "controller/stick";
    this.ledTopic = "programming/code";
    this.modeTopic = "controller/action";
    this.publishFrequency = 100; // Send MQTT message every 100ms
    this.go1State = getGo1StateCopy();
  }

  connect = () => {
    console.log("connecting");
    this.client = connect(this.iClientOptions);

    this.client.on("connect", () => {
      console.log("connected");
      this.connected = true;
      this.go1.publishConnectionStatus(true);
    });

    this.client.on("close", () => {
      this.connected = false;
    });

    this.client.on("disconnect", () => {
      console.log("disconnected");
      this.go1.publishConnectionStatus(false);
    });

    this.client.on("offline", () => {
      console.log("disconnected");
      this.go1.publishConnectionStatus(false);
    });

    // Handle messages that come from various topics
    this.client.on("message", (topic, message) => {
      this.go1.publishState(this.go1State);
      messageHandler(topic, message, this.go1State);
    });
  };

  // Subscribe to topics for updates
  subscribe = () => {
    this.client?.subscribe(["bms/state", "firmware/version"]);
  };

  getState = (): Go1State => {
    return this.go1State;
  };

  disconnect = () => {
    this.client?.end();
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
