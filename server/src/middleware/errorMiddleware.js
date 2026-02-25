import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const errorHandler = (err, req, res, next) => {

  const log = `
${new Date().toISOString()}
URL: ${req.originalUrl}
METHOD: ${req.method}
MESSAGE: ${err.message}
STACK: ${err.stack}
---------------------------------------
`;

  fs.appendFileSync(path.join(logDir, "error.log"), log);

  console.error(err); // show exact error in console
  console.log("Error middleware triggered");

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};