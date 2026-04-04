const request = require("supertest");
const { createApp } = require("../src/server");

test("GET /api/nomes devolve lista de pessoas", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, nome: "fabricio" }] }),
  };
  const app = createApp(mockPool);
  const response = await request(app).get("/api/nomes");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([{ id: 1, nome: "fabricio" }]);
});

test("GET /api/nomes falha quando o banco não está acessível", async () => {
  const mockPool = {
    query: jest.fn().mockRejectedValue(new Error("connection refused")),
  };
  const app = createApp(mockPool);
  const response = await request(app).get("/api/nomes");
  expect(response.status).toBe(500);
});

test("POST /api/nome insere pessoa e devolve mensagem", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };
  const app = createApp(mockPool);
  const response = await request(app).post("/api/nome").send({ nome: "fabricio" });
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ mensagem: "fabricio ama Satubinha" });
});

test("DELETE /api/nome/:id deleta pessoa e devolve mensagem", async () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };
  const app = createApp(mockPool);
  const response = await request(app).delete("/api/nome/1");
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ mensagem: "Registro deletado" });
});
