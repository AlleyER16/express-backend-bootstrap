import fs from "fs";
import path from "path";

export default class LoggerService {
  static getLogFile() {
    const logDir = path.join(process.cwd(), "logs/__app-logs"); // Directory for logs
    const logFile = path.join(logDir, `logs_${new Date().toISOString().slice(0, 10)}.log`);

    // Ensure the directory exists
    if (!fs.existsSync(logDir))
      fs.mkdirSync(logDir, {
        recursive: true,
      });

    return logFile;
  }

  static log(
    level: "info" | "warning" | "error",
    message: string,
    logInfo?: {
      data?: Record<string, any>;
      error?: Error;
    },
  ) {
    const { data, error } = logInfo || {};

    let logData = `[Log Entry]\n`;
    logData += `=> Level: ${level.toUpperCase()}\n`;
    logData += `=> Timestamp: ${new Date().toString()}\n`;
    logData += `=> Message: ${message}\n`;
    if (data) logData += `=> Data:\n${JSON.stringify(data, null, 4)}\n`;
    if (error) logData += `=> Stacktrace:\n${error.stack}\n`;
    logData += "\n";

    // Console fall back
    console.log(logData);

    fs.appendFileSync(this.getLogFile(), logData, { encoding: "utf-8" });
  }
}
