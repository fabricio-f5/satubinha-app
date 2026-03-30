const fs = require("fs");
const { Pool } = require("pg");
const { createApp } = require("./server");

const pool = new Pool({
  host: "db",
  user: fs.readFileSync("/run/secrets/db_user", "utf8").trim(),
  password: fs.readFileSync("/run/secrets/db_password", "utf8").trim(),
  database: fs.readFileSync("/run/secrets/db_name", "utf8").trim(),
  port: 5432,
});

const app = createApp(pool);
app.listen(4000, () => console.log("API rodando na porta 4000"));