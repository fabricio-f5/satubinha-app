const fs = require("fs");
const { Pool } = require("pg");
const { createApp } = require("./server");

function readSecret(filePath, envVar) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return process.env[envVar] || "";
  }
}

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: readSecret("/run/secrets/db_user", "DB_USER"),
  password: readSecret("/run/secrets/db_password", "DB_PASSWORD"),
  database: readSecret("/run/secrets/db_name", "DB_NAME"),
  port: parseInt(process.env.DB_PORT || "5432"),
});

const app = createApp(pool);
app.listen(process.env.API_PORT || 4000, () =>
  console.log("API rodando na porta 4000")
);