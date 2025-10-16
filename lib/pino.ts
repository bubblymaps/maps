// pino logging
// logs/app.log

import pino from "pino";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) 
{
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, "app.log");

export const log = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: { pid: false },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  
  pino.destination(logFile)
);
