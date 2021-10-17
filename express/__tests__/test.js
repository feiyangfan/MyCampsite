const request = require("supertest");
const app = require("../app");

test("test index page", async () => {
    const res = await request(app)
        .get("/")
    expect(res.statusCode).toEqual(200);
});
