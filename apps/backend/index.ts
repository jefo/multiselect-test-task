import express from "express";
import { createItemRouter } from "./src/routes/itemRoutes";
import {
  corsMiddleware,
  rateLimiter,
  errorHandler,
  requestLogger,
} from "./src/middleware";
import { logger } from "./src/utils/logger";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(errorHandler);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(requestLogger);

app.use("/api", createItemRouter());

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
