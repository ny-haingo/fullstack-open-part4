const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const Blog = require("./models/blog");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
