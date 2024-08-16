import express from "express";
import cors from "cors";
import path from "path";

import env from "./configs/environments";
import { authenticateDatabase, syncDatabase } from "./configs/database";
import responseFormatter from "./middlewares/formatResponse";
import routes from "./routes";

const app = express();

app.use(express.json({ limit: "10mb" })); // Thay đổi kích thước theo nhu cầu
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.static(env.publicDir));
console.log(env.publicDir);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(responseFormatter);
routes(app);

const port = env.port;
const startServer = async () => {
  try {
    await authenticateDatabase();
    await syncDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
};

startServer();
