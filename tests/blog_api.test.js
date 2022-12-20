const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testBlogs = require("../utils/testBlogs");
const Blog = require("../models/blog");

const { info } = require("../utils/logger");

const api = supertest(app);

// beforeEach(async () => {
//   await Blog.deleteMany({});

//   for (let blog of testBlogs) {
//     let blogObject = new Blog(blog);
//     await blogObject.save();
//   }
// });

beforeEach(async () => {
  await Blog.deleteMany({});

  const BlogObjects = testBlogs.map((blog) => new Blog(blog));
  const promiseArray = BlogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
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

afterAll(() => {
  mongoose.connection.close();
});
