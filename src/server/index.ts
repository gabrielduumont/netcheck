import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { runSpeedTestInInterval } from "./speedtest";

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get("/service-health", (req, res) => {
  res.status(200).send({ message: "service is up and running." });
});
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  runSpeedTestInInterval(5 * 60, undefined);
  console.log(`service is up and running on port ${port}!`);
});
