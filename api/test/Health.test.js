const request = require("supertest");
const { createApp } = require("../src/server");

test("GET /health devolve 200 e status ok", async () => {
  const app = createApp({});
  const response = await request(app).get("/health");

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ status: "ok" });
});