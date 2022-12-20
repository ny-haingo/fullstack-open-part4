const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testBlogs = require("../utils/testBlogs");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const BlogObjects = testBlogs.map((blog) => new Blog(blog));
  const promiseArray = BlogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("get tests", () => {
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

describe("post tests", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "We need love",
      author: "Miantsa",
      url: "url",
      like: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(testBlogs.length + 1);
    expect(titles).toContain("We need love");
  });
});

describe("validity", () => {
  test("the unique identifier property of the blog posts is named id", () => {
    const newBlog = new Blog();
    expect(newBlog.id).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
