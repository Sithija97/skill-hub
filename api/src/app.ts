import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import { errorHandler } from "./common/errors/error-handler.js";
import { config } from "./config.js";

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api", router);

app.use(errorHandler);

export default app;
