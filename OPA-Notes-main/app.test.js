const request = require("supertest");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const app = require("./app");

const mock = new MockAdapter(axios);

describe("GET /", () => {
  it("should return API is running", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API is running");
  });
});

describe("POST /secure", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should grant access when OPA allows", async () => {
    mock.onPost("http://localhost:8181/v1/data/auth/allow").reply(200, {
      result: true
    });

    const res = await request(app)
      .post("/secure")
      .send({ user: { role: "admin" } });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access Granted");
  });

  it("should deny access when OPA denies", async () => {
    mock.onPost("http://localhost:8181/v1/data/auth/allow").reply(200, {
      result: false
    });

    const res = await request(app)
      .post("/secure")
      .send({ user: { role: "user" } });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access Denied");
  });

  it("should return 500 when OPA call fails", async () => {
    mock.onPost("http://localhost:8181/v1/data/auth/allow").networkError();

    const res = await request(app)
      .post("/secure")
      .send({ user: { role: "admin" } });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
