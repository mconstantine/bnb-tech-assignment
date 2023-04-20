import * as dotenv from "dotenv";
dotenv.config();

const SERVER_PORT = process.env["SERVER_PORT"];

if (!SERVER_PORT) {
  throw new Error('Unable to find environment variable: "SERVER_PORT"');
}

export const env = {
  SERVER_PORT,
};
