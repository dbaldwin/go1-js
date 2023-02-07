export type AiMode = "MNFH" | "cam1" | "cam2" | "cam3" | "cam4" | "cam5";

export interface Go1State {
  mqttConnected: boolean;
  managerOn: boolean;
  controllerOn: boolean;
  bms: {
    version: string;
    status: number;
    soc: number;
    current: number;
    cycle: number;
    temps: number[];
    voltage: number;
    cellVoltages: number[];
  };
  robot: {
    sn: {
      product: string;
      id: string;
    };
    version: {
      hardware: string;
      software: string;
    };
    temps: number[];
    mode: number;
    gaitType: number;
    obstacles: number[];
    state: string;
    distanceWarning: {
      front: number;
      back: number;
      left: number;
      right: number;
    };
  };
}

const data: Go1State = {
  mqttConnected: false,
  managerOn: false,
  controllerOn: false,
  bms: {
    version: "unknown",
    status: 0,
    soc: 0,
    current: 0,
    cycle: 0,
    temps: new Array(4).fill(0),
    voltage: 0,
    cellVoltages: new Array(10).fill(0),
  },
  robot: {
    version: {
      hardware: "--",
      software: "--",
    },
    sn: {
      product: "--",
      id: "--",
    },
    temps: new Array(20).fill(0),
    mode: 0,
    gaitType: 0,
    obstacles: [255, 255, 255, 255],
    state: "invalid",
    distanceWarning: {
      front: 0,
      back: 0,
      left: 0,
      right: 0,
    },
  },
};

const dataCopy = JSON.stringify(data);

export const getGo1StateCopy = () => {
  return JSON.parse(dataCopy) as Go1State;
};
