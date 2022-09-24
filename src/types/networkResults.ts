import { ParsedNetworkSpeed } from "./networkSpeed";
import { ParsedPing } from "./ping";

export type NetworkTestResult = {
  datetimeExecuted: string;
  downloadBps: string;
  downloadKbps: string;
  downloadMbps: string;
  uploadBps: string;
  uploadKbps: string;
  uploadMbps: string;
  pingInputHost: string;
  pingTime: string;
  pingMin: string;
  pingMax: string;
  pingAvg: string;
  pingPacketLoss: string;
  elapsedTimeForTest: string;
};

export type NetworkJsonTestResult = {
  datetimeExecuted: string;
  download: ParsedNetworkSpeed;
  upload: ParsedNetworkSpeed;
  ping: ParsedPing;
  pingUnit: "ms";
};

export type ReportSummary = {
  numberOfTimesMeasured: number;
  timeFrame: {
    start: string;
    end: string;
  };
  download: {
    avgBps: number;
    minBps: number;
    maxBps: number;
    avgKbps: number;
    minKbps: number;
    maxKbps: number;
    avgMbps: number;
    minMbps: number;
    maxMbps: number;
  };
  upload: {
    avgBps: number;
    minBps: number;
    maxBps: number;
    avgKbps: number;
    minKbps: number;
    maxKbps: number;
    avgMbps: number;
    minMbps: number;
    maxMbps: number;
  };
  ping: {
    inputHost: string;
    time: number;
    min: number;
    max: number;
    avg: number;
    packetLoss: string;
    pingUnit: string;
  };
};
