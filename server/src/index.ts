import express from "express";
import cors from "cors";
import meta from "../package.json";
import { env } from "./env";
import { withDatabase } from "./database/database";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  const { name, version } = meta;
  res.json({ name, version });
});

withDatabase(() => Promise.resolve()).then(
  () => {
    app.listen(env.SERVER_PORT, () => {
      console.log(`Server ready on port ${env.SERVER_PORT}`);
    });
  },
  (e) => {
    console.log("Unable to connect to database");
    console.log(e);
    process.exit();
  }
);
