import {
  NetworkSpeedReturn,
  ParsedNetworkSpeed,
} from "@app/types/networkSpeed";
import NetworkSpeed from "network-speed";

const testNetworkSpeed = new NetworkSpeed();

const parseNetworkSpeedReturn = (speed: NetworkSpeedReturn) =>
  ({
    bps: parseFloat(speed.bps),
    kbps: parseFloat(speed.kbps),
    mbps: parseFloat(speed.mbps),
  } as ParsedNetworkSpeed);

export const getNetworkDownloadSpeed = async (host?: string | null) => {
  const baseUrl = host ?? "https://eu.httpbin.org/stream-bytes/500000";
  const fileSizeInBytes = 500000;
  const speed = await testNetworkSpeed.checkDownloadSpeed(
    baseUrl,
    fileSizeInBytes
  );
  // console.log(speed);
  return parseNetworkSpeedReturn(speed);
};

export const getNetworkUploadSpeed = async (host?: string | null) => {
  const options = {
    hostname: host ?? "www.google.com",
    port: 80,
    path: "/catchers/544b09b4599c1d0200000289",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const fileSizeInBytes = 2000000;
  const speed = await testNetworkSpeed.checkUploadSpeed(
    options,
    fileSizeInBytes
  );
  // console.log(speed);
  return parseNetworkSpeedReturn(speed);
};
