import { Go1State } from "../go1-state";
import { BmsSubTopic } from "../topics";

type Receivers = {
  [key in BmsSubTopic]: (
    data: Go1State,
    message: Buffer,
    dataView: DataView
  ) => void;
};

const receivers: Receivers = {
  "bms/state": (data, message, dataView) => {
    const uint8s = new Uint8Array(message);
    //console.log(uint8s);
    data.bms.version = uint8s[0] + "." + uint8s[1];
    data.bms.status = uint8s[2];
    data.bms.soc = uint8s[3];
    data.bms.current = dataView.getInt32(4, true);
    data.bms.cycle = dataView.getUint16(8, true);
    data.bms.temps = [uint8s[10], uint8s[11], uint8s[12], uint8s[13]];
    for (let i = 0; i < 10; i++) {
      data.bms.cellVoltages[i] = dataView.getUint16(14 + i * 2, true);
    }
    data.bms.voltage = data.bms.cellVoltages.reduce((a, c) => a + c);
  },
};

export default receivers;
