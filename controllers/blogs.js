const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blogs = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;
  if (!user) {return response.status(401).json({error: "No token"})}
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  });

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: "title or url missing",
    });
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    const user = request.user;
    if (user) {
      if (blog.user.toString() === user._id.toString()) {
        await blog.remove();
        response.status(204).end();
      } else {
        return response.status(401).json({ error: error.message });
      }
    } else {
      return response.status(401).json({ error: error.message });
    }
  } else {
    return response.status(404);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(result);
});

module.exports = blogsRouter;
