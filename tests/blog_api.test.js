const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testBlogs = require("../utils/testBlogs");
const Blog = require("../models/blog");

const { info } = require("../utils/logger");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of testBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("The right HTTP request", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(testBlogs.length);
  });
});

test("the unique identifier property of the blog posts is named id", () => {
  const newBlog = new Blog();
  expect(newBlog.id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
