import {
  NetworkJsonTestResult,
  NetworkTestResult,
} from "@app/types/networkResults";
import fs from "fs";
import path from "path";

export const displayTestResultsLog = (results: NetworkTestResult) => {
  console.log("----");
  console.table(results);
  console.log("----");
};

export const saveTestResultsLog = (results: NetworkTestResult) => {
  const fileName = `${results.datetimeExecuted.substring(0, 10)}.csv`;
  const filePath = path.resolve(__dirname, `../logs/${fileName}`);
  if (!fs.existsSync(filePath)) {
    fs.appendFileSync(
      filePath,
      "datetimeExecuted, downloadBps, downloadKbps, downloadMbps, uploadBps, uploadKbps, uploadMbps, pingInputHost, pingTime, pingMin, pingMax, pingAvg, pingPacketLoss, elapsedTimeForTest\n"
    );
  }
  fs.appendFileSync(
    filePath,
    `${results.datetimeExecuted}, ${results.downloadBps}, ${results.downloadKbps}, ${results.downloadMbps}, ${results.uploadBps}, ${results.uploadKbps}, ${results.uploadMbps}, ${results.pingInputHost}, ${results.pingTime}, ${results.pingMin}, ${results.pingMax}, ${results.pingAvg}, ${results.pingPacketLoss}, ${results.elapsedTimeForTest}\n`
  );
};

export const saveTestResultsJson = (results: NetworkJsonTestResult) => {
  const fileName = `${results.datetimeExecuted
    .replace(/\:/g, "-")
    .replace(/\./g, "-")}.json`;
  const filePath = path.resolve(__dirname, `../results/${fileName}`);
  fs.appendFileSync(filePath, JSON.stringify(results));
};
