import express from "express";
import cors from "cors";
import meta from "../package.json";
import { env } from "./env";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  const { name, version } = meta;
  res.json({ name, version });
});

app.listen(env.SERVER_PORT, () => {
  console.log(`Server ready on port ${env.SERVER_PORT}`);
});
