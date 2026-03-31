const request = require("supertest");
const { createApp } = require("../src/server");

test("GET /nomes devolve lista de pessoas", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, nome: "fabricio" }] }),
  };

  const app = createApp(mockPool);
  const response = await request(app).get("/nomes");

  expect(response.status).toBe(200);
  expect(response.body).toEqual([{ id: 1, nome: "fabricio" }]);
});

test("GET /nomes falha quando o banco não está acessível", async () => {
  const mockPool = {
    query: jest.fn().mockRejectedValue(new Error("connection refused")),
  };

  const app = createApp(mockPool);
  const response = await request(app).get("/nomes");

  expect(response.status).toBe(500);
});

test("POST /nome insere pessoa e devolve mensagem", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };

  const app = createApp(mockPool);
  const response = await request(app).post("/nome").send({ nome: "fabricio" });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ mensagem: "fabricio ama Satubinha" });
});

test("DELETE /nome/:id deleta pessoa e devolve mensagem", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };

  const app = createApp(mockPool);
  const response = await request(app).delete("/nome/1");

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ mensagem: "Registro deletado" });
});