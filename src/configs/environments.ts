import dotenv from "dotenv";
dotenv.config();
import path from "path";

const environment = {
  port: parseInt(process.env.PORT || "3000", 10),
  access_token_key: process.env.ACCESS_TOKEN_KEY || "accessToken",
  refresh_token_key: process.env.REFRESH_TOKEN_KEY || "refreshToken",
  db_host: process.env.DB_HOST || "",
  db_port: parseInt(process.env.DB_PORT || "3306", 10),
  db_user: process.env.DB_USER || "",
  db_password: process.env.DB_PASSWORD || "",
  db_name: process.env.DB_NAME || "database_name",
  publicDir: path.join(__dirname, "../../public"),
  url_api: process.env.URL_API || "",
  overlayImagePath: path.join(__dirname, "../../public/VCI-watermark.png"),
};

export default environment;
