import {
  getNetworkDownloadSpeed,
  getNetworkUploadSpeed,
} from "@app/services/networkSpeed";
import { getPing } from "@app/services/ping";
import { NetworkTestResult } from "@app/types/networkResults";
import { ParsedNetworkSpeed } from "@app/types/networkSpeed";
import { ParsedPing } from "@app/types/ping";

const parseResults = (
  downloadSpeed: ParsedNetworkSpeed,
  uploadSpeed: ParsedNetworkSpeed,
  ping: ParsedPing,
  elapsedTime: number
) => {
  return {
    datetimeExecuted: new Date().toISOString(),
    downloadBps: `${downloadSpeed.bps} bps`,
    downloadKbps: `${downloadSpeed.kbps} kbps`,
    downloadMbps: `${downloadSpeed.mbps} mbps`,
    uploadBps: `${uploadSpeed.bps} bps`,
    uploadKbps: `${uploadSpeed.kbps} kbps`,
    uploadMbps: `${uploadSpeed.mbps} mbps`,
    pingInputHost: `ping host: ${ping.inputHost}`,
    pingTime: `${ping.time} ms latency`,
    pingMin: `${ping.min.toFixed(2)} ms Min`,
    pingMax: `${ping.max.toFixed(2)} ms Max`,
    pingAvg: `${ping.avg.toFixed(2)} ms Avg`,
    pingPacketLoss: `${ping.packetLoss.toFixed(2)}% PacketLoss`,
    elapsedTimeForTest: `${elapsedTime.toFixed(2)} s`,
  } as NetworkTestResult;
};

export const runSpeedTest = async (host?: string | null) => {
  const timeStart = performance.now();

  const hostDefault = "google.com.br";

  const downloadSpeed = await getNetworkDownloadSpeed();
  const uploadSpeed = await getNetworkUploadSpeed();
  const ping = await getPing(host ?? hostDefault);

  const timeEnd = performance.now();
  const elapsedTime = (timeEnd - timeStart) / 1000;
  const results = parseResults(downloadSpeed, uploadSpeed, ping, elapsedTime);
  return {
    json: {
      downloadSpeed,
      uploadSpeed,
      ping,
      datetimeExecuted: results.datetimeExecuted,
    },
    printable: results,
  };
};
