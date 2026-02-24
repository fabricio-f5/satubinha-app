const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const dbPassword = fs
  .readFileSync("/run/secrets/db_password", "utf8")
  .trim();

const dbName = fs
  .readFileSync("/run/secrets/db_name", "utf8")
  .trim();

const dbUser = fs
  .readFileSync("/run/secrets/db_user", "utf8")
  .trim();

const pool = new Pool({
  host: "db",
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: 5432,
});

// salvar nome
app.post("/nome", async (req, res) => {
  const { nome } = req.body;

  await pool.query("INSERT INTO pessoas(nome) VALUES($1)", [nome]);

  res.json({ mensagem: `${nome} ama Satubinha` });
});

// listar nomes
app.get("/nomes", async (req, res) => {
  const result = await pool.query("SELECT * FROM pessoas");
  res.json(result.rows);
});

// deletar registro
app.delete("/nome/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM pessoas WHERE id=$1", [id]);
  res.json({ mensagem: "Registro deletado" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(4000, () => console.log("API rodando na porta 4000"));
