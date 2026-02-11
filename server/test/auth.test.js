import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth Controller Tests", () => {
  //register test

  test("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "123456",
      confirmpassword: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");

    // check DB
    const user = await User.findOne({ email: "john@test.com" });

    expect(user).not.toBeNull();
  });

  //duplicate email

  test("should NOT allow duplicate email", async () => {
    await User.create({
      name: "John",
      email: "dup@test.com",
      password: "hashed",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "John",
      email: "dup@test.com",
      password: "123456",
      confirmpassword: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  //login test

  test("should login successfully", async () => {
    // create user first
    await request(app).post("/api/auth/register").send({
      name: "Mike",
      email: "mike@test.com",
      password: "123456",
      confirmpassword: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "mike@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  //wrong password

  test("should fail login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Sam",
      email: "sam@test.com",
      password: "123456",
      confirmpassword: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "sam@test.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
