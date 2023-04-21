import * as dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env["NODE_ENV"] || "development";
const SERVER_PORT = process.env["SERVER_PORT"];
const DB_LOGGING = process.env["DB_LOGGING"] === "true";

if (!SERVER_PORT) {
  throw new Error('Unable to find environment variable: "SERVER_PORT"');
}

export const env = {
  SERVER_PORT,
  NODE_ENV,
  DB_LOGGING,
};
