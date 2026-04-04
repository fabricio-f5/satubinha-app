const express = require("express");
const cors = require("cors");

function createApp(pool) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // salvar nome
  app.post("/api/nome", async (req, res) => {
    try {
      const { nome } = req.body;
      await pool.query("INSERT INTO pessoas(nome) VALUES($1)", [nome]);
      res.json({ mensagem: `${nome} ama Satubinha` });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao salvar nome" });
    }
  });

  // listar nomes
  app.get("/api/nomes", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM pessoas");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar nomes" });
    }
  });

  // deletar registro
  app.delete("/api/nome/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM pessoas WHERE id=$1", [id]);
      res.json({ mensagem: "Registro deletado" });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao deletar registro" });
    }
  });

  // health check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
}

module.exports = { createApp };
