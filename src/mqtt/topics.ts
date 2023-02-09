export type BmsSubTopic = "bms/state";
export type FirmwareSubTopic = "firmware/version";
export type SubTopic = BmsSubTopic | FirmwareSubTopic;
export type PubTopic =
  | "controller/action"
  | "controller/stick"
  | "programming/code";
