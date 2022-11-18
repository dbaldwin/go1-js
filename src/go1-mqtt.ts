import * as mqtt from "mqtt";

export class Go1MQTT {
  client: mqtt.MqttClient | null;
  floats: Float32Array = new Float32Array(4);
  endpoint: string = "mqtt://192.168.12.1";
  connected: boolean = false;

  constructor() {
    console.log("go1 mqtt constructor");
    this.client = null;
    this.floats[0] = 0; // walk left (neg) and right (pos)
    this.floats[1] = 0; // turn left (neg) and  right (pos)
    this.floats[2] = 0;
    this.floats[3] = 0; // walk backward (neg) and forward (pos)
  }

  connect = () => {
    console.log("connecting");

    this.client = mqtt.connect(this.endpoint, {
      clientId: Math.random().toString(16).substring(2, 8),
      keepalive: 5,
    });

    this.client.on("connect", () => {
      console.log("connected");
      this.client?.publish("controller/action", "walk", { qos: 1 });
      this.connected = true;
    });
  };

  updateSpeed = (
    leftRight: number,
    turnLeftRight: number,
    backwardForward: number
  ) => {
    this.floats[0] = leftRight;
    this.floats[1] = turnLeftRight;
    this.floats[2] = 0;
    this.floats[3] = backwardForward;
  };

  sendCommand = async (lengthOfTime: number) => {
    let interval: ReturnType<typeof setInterval>;

    let zero: Float32Array = new Float32Array(4);
    zero[0] = 0;
    zero[1] = 0;
    zero[2] = 0;
    zero[3] = 0;

    // Reset speed from the buffer for a few
    this.client?.publish(
      "controller/stick",
      new Uint8Array(zero.buffer) as Buffer,
      {
        qos: 0,
      }
    );

    interval = setInterval(() => {
      console.log(`sending command ${this.floats}`);
      this.client?.publish(
        "controller/stick",
        new Uint8Array(this.floats.buffer) as Buffer,
        {
          qos: 0,
        }
      );
    }, 500);

    // Stop sending after lengthOfTime
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        clearInterval(interval);
      }, lengthOfTime);
    });
  };
}
