import "dotenv/config";
import express from "express";
import appConfig from "./configs/app.config.js";
import { connectDb } from "./configs/db.config.js";
import router from "./routers/index.js";
import { fileURLToPath } from "url";
import path from "path";
import logger from "./helpers/logger.helper.js";

import cors from "cors";  // connection with front
import { ErrorHandlerMiddleware } from "./middlewares/error.handler.js";


import dns from "node:dns/promises";
dns.setServers(["8.8.8.8" , "1.1.1.1"]);


const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use("/api", router);


app.use((err, req, res, next) => {
   console.error("ERROR:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});



app.use(ErrorHandlerMiddleware)



connectDb()
  .then(() => {
    logger.info("MongoDB connected ✅");



    app.listen(appConfig.APP_PORT, () => {
      logger.info(`Listening on port ${appConfig.APP_PORT}`);
    });
  })


  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });