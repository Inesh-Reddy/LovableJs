import express from "express";
import cors from "cors";
import env from "./config/env";
import { apiRouter } from "./routes/api";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", apiRouter);

app.listen(env.API_PORT, () => {
  console.log(`Server running on port ${env.API_PORT}`);
});

export default app;
