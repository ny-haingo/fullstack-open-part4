const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const BlogObjects = helper.testBlogs.map((blog) => new Blog(blog));
  const promiseArray = BlogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("get tests for blog", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.testBlogs.length);
  });
});

describe("post tests for blog", () => {
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

    expect(response.body).toHaveLength(helper.testBlogs.length + 1);
    expect(titles).toContain("We need love");
  });

  test("the likes property is missing from the request, it will default to the value 0", async () => {
    const newBlog = {
      title: "The missing like",
      author: "Miantsa",
      url: "url",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const responseNewBlog = response.body.find(
      (object) => object.title === "The missing like"
    );
    expect(responseNewBlog.likes).toBe(0);
  });

  test("verifies that if the title or url properties are missing from the request data", async () => {
    const newBlog = {
      author: "Miantsa",
      url: "url",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("id validity for blog", () => {
  test("the unique identifier property of the blog posts is named id", () => {
    const newBlog = new Blog();
    expect(newBlog.id).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
