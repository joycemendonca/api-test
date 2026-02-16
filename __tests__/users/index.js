const request = require("supertest");

describe("GET /users", () => {
  it("should return 200 OK", async () => {
    const response = await request("https://jsonplaceholder.typicode.com").get(
      "/users",
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
  });
});
