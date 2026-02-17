const request = require("supertest");
const app = require("../../src/app");

describe("GET /api/errors/400", () => {
  it("should return 400 status code", async () => {
    const response = await request(app).get("/api/errors/400");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Bad Request - This is a simulated 400 error",
    });
  });
});
