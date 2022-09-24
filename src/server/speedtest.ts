// import {
//   displayTestResultsLog,
//   saveTestResultsJson,
//   saveTestResultsLog,
// } from "@app/utils/logger";
// import { runSpeedTest } from "@app/utils/runSpeedTest";
import { NetworkJsonTestResult } from "@app/types/networkResults";
import {
  displayTestResultsLog,
  saveTestResultsJson,
  saveTestResultsLog,
} from "@app/utils/logger";
import { runSpeedTest } from "@app/utils/runSpeedTest";
import { generateHtmlReport } from "./reportGenerator";

export const runSpeedTestInInterval = (
  intervalInSeconds: number,
  host?: string | null
) => {
  setInterval(async () => {
    const { json, printable } = await runSpeedTest(host);
    displayTestResultsLog(printable);
    saveTestResultsLog(printable);
    const jsonData: NetworkJsonTestResult = {
      datetimeExecuted: json.datetimeExecuted,
      download: json.downloadSpeed,
      upload: json.uploadSpeed,
      ping: json.ping,
      pingUnit: "ms",
    };
    saveTestResultsJson(jsonData);
    await generateHtmlReport();
  }, intervalInSeconds * 1000);
};
