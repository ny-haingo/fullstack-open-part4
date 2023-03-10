const { dummy, totalLikes, favoriteBlog } = require("../utils/list_helper");

const helper = require('./test_helper')
const listWithOneBlog = [helper.testBlogs[0]];

test("dummy returns one", () => {
  const result = dummy([]);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("an empty list is zero", () => {
    const result = totalLikes([]);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the like of that", () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(12);
  });

  test("of a bigger list is calculated right", () => {
    const result = totalLikes(helper.testBlogs);
    expect(result).toBe(142);
  });
});

test(" the most liked blog", () => {
  const result = favoriteBlog(helper.testBlogs);
  const mostPopular = {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    url: "https://www.goodreads.com/book/show/5457?ac=1&from_search=true&qid=4Z0xIwL1vV&rank=1",
    likes: 30,
  };
  expect(result).toEqual(mostPopular);
});
