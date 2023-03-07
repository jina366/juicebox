const express = require("express");
const { getAllTags, getPostsByTagName } = require("../db");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get("/", async (req, res) => {
  try {
    const tags = await getAllTags();
  
    res.send({
      tags,
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const allPostByTagName = await getPostsByTagName(tagName);

    const postByTagName = allPostByTagName.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({ postByTagName });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
