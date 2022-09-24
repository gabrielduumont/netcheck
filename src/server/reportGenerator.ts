import {
  NetworkJsonTestResult,
  ReportSummary,
} from "@app/types/networkResults";
import { ParsedNetworkSpeed } from "@app/types/networkSpeed";
import { ParsedPing } from "@app/types/ping";
import fs from "fs";
import lodash from "lodash";
import { DateTime } from "luxon";
import path from "path";

const getReportTimeFrame = (results: NetworkJsonTestResult[]) => {
  const sortedResults = lodash.orderBy(
    results,
    (result) => result.datetimeExecuted,
    "asc"
  );
  return {
    start: sortedResults[0].datetimeExecuted,
    end: sortedResults[results.length - 1].datetimeExecuted,
  };
};

const calculateSpeedResultsSummary = (speedResults: ParsedNetworkSpeed[]) => {
  return {
    avgBps:
      lodash.sumBy(speedResults, (item) => item.bps) / speedResults.length,
    minBps: lodash.minBy(speedResults, (item) => item.bps)?.bps ?? 0,
    maxBps: lodash.maxBy(speedResults, (item) => item.bps)?.bps ?? 0,
    avgKbps:
      lodash.sumBy(speedResults, (item) => item.kbps) / speedResults.length,
    minKbps: lodash.minBy(speedResults, (item) => item.kbps)?.kbps ?? 0,
    maxKbps: lodash.maxBy(speedResults, (item) => item.kbps)?.kbps ?? 0,
    avgMbps:
      lodash.sumBy(speedResults, (item) => item.mbps) / speedResults.length,
    minMbps: lodash.minBy(speedResults, (item) => item.mbps)?.mbps ?? 0,
    maxMbps: lodash.maxBy(speedResults, (item) => item.mbps)?.mbps ?? 0,
  };
};

const calculatePingResultsSummary = (
  pingResults: ParsedPing[],
  inputHost: string,
  pingUnit: string
) => {
  return {
    inputHost,
    time: lodash.sumBy(pingResults, (ping) => ping.time) / pingResults.length,
    min: lodash.sumBy(pingResults, (ping) => ping.min) / pingResults.length,
    max: lodash.sumBy(pingResults, (ping) => ping.max) / pingResults.length,
    avg: lodash.sumBy(pingResults, (ping) => ping.avg) / pingResults.length,
    packetLoss: `${(
      lodash.sumBy(pingResults, (ping) => ping.packetLoss) / pingResults.length
    ).toFixed(2)}%`,
    pingUnit,
  };
};

const generateReportData = async () => {
  const files = fs.readdirSync(path.join(__dirname, "../results"));
  const reportData = await Promise.all(
    files.map(async (file) => {
      const jsonData: NetworkJsonTestResult = await import(
        path.join(__dirname, `../results/${file}`)
      );
      return jsonData;
    })
  );

  const downloadSummary = calculateSpeedResultsSummary(
    reportData.map((item) => item.download)
  );
  const uploadSummary = calculateSpeedResultsSummary(
    reportData.map((item) => item.upload)
  );

  const pingSummary = calculatePingResultsSummary(
    reportData.map((item) => item.ping),
    reportData[0].ping.inputHost,
    reportData[0].pingUnit
  );

  const timeFrameSummary = getReportTimeFrame(reportData);

  const reportSummary = {
    numberOfTimesMeasured: reportData.length,
    timeFrame: timeFrameSummary,
    download: downloadSummary,
    upload: uploadSummary,
    ping: pingSummary,
  };

  return { reportData, reportSummary };
};

const INITIAL_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>__REPORT_TITLE__</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    __REPORT_BODY__
    <script src="/script.js"></script>
  </body>
</html>
`;

const generateHtmlContent = (
  reportData: NetworkJsonTestResult[],
  reportSummary: ReportSummary
) => {
  const start = `
    <div class="report-title-time-start report-title-column">
      <span>${DateTime.fromISO(reportSummary.timeFrame.start).toFormat(
        "dd/LL/yyyy HH:mm:ss"
      )}</span>
      <small>data de início da medição</small>
    </div>
  `;
  const end = `
    <div class="report-title-time-end report-title-column">
      <span>${DateTime.fromISO(reportSummary.timeFrame.end).toFormat(
        "dd/LL/yyyy HH:mm:ss"
      )}</span>
      <small>data de fim da medição</small>
    </div>
  `;
  const timesMeasured = `
    <div class="report-title-times-measured report-title-column">
      <span>${reportSummary.numberOfTimesMeasured}</span>
      <small>quantidade de medições realizadas</small>
    </div>
  `;

  const title = `
    <section class="report-title">
      ${start}
      ${end}
      ${timesMeasured}
    </section>
  `;

  const downloadSummary = `
    <div class="report-summary-download">
      <div class="speedRowContainer">
        <span class="rowTitle">download</span>
        <div class="rowData">
          <div class="column">
            <span>${reportSummary.download.minMbps.toFixed(2)} Mbps</span>
            <span>min</span>
          </div>
          <div class="column">
            <span>${reportSummary.download.avgMbps.toFixed(2)} Mbps</span>
            <span>média</span>
          </div>
          <div class="column">
            <span>${reportSummary.download.maxMbps.toFixed(2)} Mbps</span>
            <span>max</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const uploadSummary = `
    <div class="report-summary-upload">
      <div class="speedRowContainer">
        <span class="rowTitle">upload</span>
        <div class="rowData">
          <div class="column">
            <span>${reportSummary.upload.minMbps.toFixed(2)} Mbps</span>
            <span>min</span>
          </div>
          <div class="column">
            <span>${reportSummary.upload.avgMbps.toFixed(2)} Mbps</span>
            <span>média</span>
          </div>
          <div class="column">
            <span>${reportSummary.upload.maxMbps.toFixed(2)} Mbps</span>
            <span>max</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const pingSummary = `
    <div class="report-summary-ping">
      <span class="rowTitle">ping</span>
      <div class="pingRow">
        <div class="pingColumn">
          <span>${reportSummary.ping.inputHost}</span>
          <span>host</span>
        </div> 
        <div class="pingColumn">
          <span>${reportSummary.ping.time.toFixed(2)} ${
    reportSummary.ping.pingUnit
  }</span>
          <span>tempo</span>
        </div> 
        <div class="pingColumn">
          <span>${reportSummary.ping.min.toFixed(2)} ${
    reportSummary.ping.pingUnit
  }</span>
          <span>min</span>
        </div> 
        <div class="pingColumn">
          <span>${reportSummary.ping.avg.toFixed(2)} ${
    reportSummary.ping.pingUnit
  }</span>
          <span>média</span>
        </div> 
        <div class="pingColumn">
          <span>${reportSummary.ping.max.toFixed(2)} ${
    reportSummary.ping.pingUnit
  }</span>
          <span>max</span>
        </div> 
        <div class="pingColumn">
          <span>${reportSummary.ping.packetLoss}</span>
          <span>média de perda<br/>de pacotes</span>
        </div> 
      </div> 
    </div>
  `;

  const summary = `
    <section class="report-summary">
      ${downloadSummary}
      ${uploadSummary}
      ${pingSummary}
    </section>
  `;

  const reportDataTableRow = reportData.map((item) => {
    return `
      <tr>
        <td>${DateTime.fromISO(item.datetimeExecuted).toFormat(
          "dd/LL/yyyy HH:mm:ss"
        )}</td>
        <td>
          ${item.download.bps.toFixed(2)} bps<br />
          ${item.download.kbps.toFixed(2)} kbps<br />
          ${item.download.mbps.toFixed(2)} mbps
        </td>
        <td>
          ${item.upload.bps.toFixed(2)} bps<br />
          ${item.upload.kbps.toFixed(2)} kbps<br />
          ${item.upload.mbps.toFixed(2)} mbps
        </td>
        <td>
          host: ${item.ping.inputHost}<br />
          tempo: ${item.ping.time.toFixed(2)} ${item.pingUnit}<br />
          tempoMin: ${item.ping.min.toFixed(2)} ${item.pingUnit}<br />
          tempoMédio: ${item.ping.avg.toFixed(2)} ${item.pingUnit}<br />
          tempoMax: ${item.ping.max.toFixed(2)} ${item.pingUnit}<br />
          perda de pacotes: ${item.ping.packetLoss.toFixed(2)} %<br />
        </td>
      </tr>
    `;
  });

  const reportDataTable = `
    <section class="report-data-table">
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Download</th>
            <th>Upload</th>
            <th>Ping</th>
          </tr>
        </thead>
        <tbody>
          ${reportDataTableRow.join("")}
        </tbody>
      </table>
    </section>
  `;

  return `
    ${title}
    ${summary}
    ${reportDataTable}
  `;
};

export const generateHtmlReport = async () => {
  const { reportData, reportSummary } = await generateReportData();
  const filePath = path.resolve(__dirname, `../public/index.html`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const reportHtmlContent = INITIAL_HTML.replace(
    /__REPORT_TITLE__/g,
    "netCheck Report"
  ).replace(/__REPORT_BODY__/g, generateHtmlContent(reportData, reportSummary));

  fs.appendFileSync(filePath, reportHtmlContent);
};
