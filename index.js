const http = require("http");
const config = require("./utils/config");
const blogsRouter = require('./controllers/blogs')
const logger = require("./utils/logger");
const express = require("express");
const Blog = require("./models/blog");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
