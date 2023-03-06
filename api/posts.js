const express = require('express');
const { getAllPosts, createPost, getPostById, updatePost } = require('../db');
const postsRouter = express.Router();
const { requireUser } = require('./utils');


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags ="" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
        postData.tags = tagArr;
    }

    try {
        postData.authorId = req.user.id
        postData.title = title
        postData.content = content

        const post = await createPost(postData)
        if (post) {
            res.send({ post })
        }

    } catch ({ name, message }) {
        next({ name, message });
        
    }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const updateFields = {};

    if (tags && tags.length > 0) {
        updateFields.tags = tags.trim().split(/\s+/);
    }

    if (title) {
        updateFields.title = title;
    }

    if (content) {
        updateFields.content = content;
    }
    const post_Id = Number(postId)
    try {
        const originalPost = await getPostById(post_Id);
        console.log(originalPost,typeof post_Id, "test")

        if (originalPost.author.id === req.user.id) {
            console.log("HI")
            const updatedPost = await updatePost(post_Id, updateFields);
            console.log(updatedPost, "test 2")
            res.send({ post: updatedPost})
        } else {
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});

  postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
      posts
    });
  });


module.exports = postsRouter;