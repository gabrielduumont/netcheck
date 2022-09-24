import { ParsedPing, PingReturn } from "@app/types/ping";
import ping from "ping";

const parsePingReturn = (pingReturn: PingReturn) =>
  ({
    inputHost: pingReturn.inputHost,
    time: pingReturn.time,
    min: parseFloat(pingReturn.min),
    max: parseFloat(pingReturn.max),
    avg: parseFloat(pingReturn.avg),
    packetLoss: parseFloat(pingReturn.packetLoss),
  } as ParsedPing);

export const getPing = async (
  host = "https://eu.httpbin.org/stream-bytes/500000"
) => {
  const pingResponse = await ping.promise.probe(host);
  return parsePingReturn(pingResponse as PingReturn);
};
