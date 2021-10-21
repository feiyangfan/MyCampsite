import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";

afterAll((done) => {
  mongoose.connection.close();
  done();
});

test("test index page", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toEqual(200);
});
