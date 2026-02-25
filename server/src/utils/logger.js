import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logPath = path.join(__dirname, "../logs/error.log");

if (!fs.existsSync(path.join(__dirname, "../logs"))) {
  fs.mkdirSync(path.join(__dirname, "../logs"));
}

const logger = (err) => {
  const log = `
${new Date().toISOString()}
MESSAGE: ${err.message}
STACK: ${err.stack}
----------------------------------------
`;

  fs.appendFileSync(logPath, log);
  console.error(err); // still show exact error in console
};

export default logger;