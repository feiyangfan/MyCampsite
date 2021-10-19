import request from "supertest";
import app from "../app.js";

test("test index page", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toEqual(200);
});
