import { MqttData } from "./data";
import { SubTopic } from "./topics";
import bmsReceivers from "./receivers/bms-receiver";
import robotReceivers from "./receivers/robot-receiver";

type Receivers = {
  [key in SubTopic]: (
    data: MqttData,
    message: Buffer,
    dataView: DataView
  ) => void;
};

const messageReceivers: Receivers = {
  ...bmsReceivers,
  ...robotReceivers,
};

export default function messageHandler(
  topic: string,
  message: Buffer,
  data: MqttData
) {
  const msgTopic = topic as SubTopic;
  const dataView = new DataView(
    message.buffer,
    message.byteOffset,
    message.byteLength
  );
  const receiver = messageReceivers[msgTopic];
  if (receiver) receiver(data, message, dataView);
  else console.log(message);
}
