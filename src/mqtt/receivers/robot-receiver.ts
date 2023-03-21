import { Go1State } from "../go1-state";
import { FirmwareSubTopic } from "../topics";

type Receivers = {
  [key in FirmwareSubTopic]: (
    data: Go1State,
    message: Buffer,
    dataView: DataView
  ) => void;
};

function distanceToWarning(distance: number) {
  if (distance > 30) return 0;
  else if (distance < 10) return 1;
  else {
    return 0.2 + (0.8 * (30 - distance)) / 20;
  }
}

const receivers: Receivers = {
  "firmware/version": (data, message, dataView) => {
    //console.log(dataView);
    data.robot.temps = data.robot.temps.map((v, i) => dataView.getUint8(i + 8));
    if (dataView.byteLength > 28) {
      data.robot.mode = dataView.getUint8(28);
      data.robot.gaitType = dataView.getUint8(29);
      data.robot.obstacles = data.robot.obstacles.map((v, i) =>
        dataView.getUint8(i + 30)
      );
      if (data.robot.mode === 2) {
        if (data.robot.gaitType === 2) data.robot.state = "run";
        else if (data.robot.gaitType === 3) data.robot.state = "climb";
        else if (data.robot.gaitType === 1) data.robot.state = "walk";
      }

      data.robot.distanceWarning = {
        front: distanceToWarning(data.robot.obstacles[0]),
        back: distanceToWarning(data.robot.obstacles[3]),
        left: distanceToWarning(data.robot.obstacles[1]),
        right: distanceToWarning(data.robot.obstacles[2]),
      };
    }
    if (dataView.byteLength >= 44) {
      let name = "";
      switch (dataView.getUint8(0)) {
        case 1:
          name = "Laikago";
          break;
        case 2:
          name = "Aliengo";
          break;
        case 3:
          name = "A1";
          break;
        case 4:
          name = "Go1";
          break;
        case 5:
          name = "B1";
          break;
      }
      let model = "";
      switch (dataView.getUint8(1)) {
        case 1:
          model = "AIR";
          break;
        case 2:
          model = "PRO";
          break;
        case 3:
          model = "EDU";
          break;
        case 4:
          model = "PC";
          break;
        case 5:
          model = "XX";
          break;
      }
      if (name != "") data.robot.sn.product = name + "_" + model;

      if (dataView.getUint8(2) < 255)
        data.robot.sn.id =
          dataView.getUint8(2) +
          "-" +
          dataView.getUint8(3) +
          "-" +
          dataView.getUint8(4) +
          "[" +
          dataView.getUint8(5) +
          "]";
      if (dataView.getUint8(36) < 255)
        data.robot.version.hardware =
          dataView.getUint8(36) +
          "." +
          dataView.getUint8(37) +
          "." +
          dataView.getUint8(38);
      data.robot.version.software =
        dataView.getUint8(39) +
        "." +
        dataView.getUint8(40) +
        "." +
        dataView.getUint8(41);
    }
  },
};

export default receivers;
