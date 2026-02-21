const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "db",
  user: "postgres",
  password: "postgres",
  database: "satubinha",
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

app.listen(4000, () => console.log("API rodando na porta 4000"));
