import { Go1State } from "./go1-state";
import { SubTopic } from "./topics";
import bmsReceivers from "./receivers/bms-receiver";
import robotReceivers from "./receivers/robot-receiver";

type Receivers = {
  [key in SubTopic]: (
    data: Go1State,
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
  data: Go1State
) {
  const msgTopic = topic as SubTopic;
  const dataView = new DataView(
    message.buffer,
    message.byteOffset,
    message.byteLength
  );
  const receiver = messageReceivers[msgTopic];
  if (receiver) receiver(data, message, dataView);
  //else console.log(message);
}
