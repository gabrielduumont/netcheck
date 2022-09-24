export type PingReturn = {
  inputHost: string;
  time: number; //in ms
  min: string;
  max: string;
  avg: string;
  packetLoss: string;
};

export type ParsedPing = {
  inputHost: string;
  time: number; //in ms
  min: number;
  max: number;
  avg: number;
  packetLoss: number;
};
