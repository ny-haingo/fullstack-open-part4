const lodash = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item;

  return blogs.map((blog) => blog.likes).reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.sort((a, b) => b.likes - a.likes);

  return favorite[0] || null;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
