const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');

const { createPost, getPosts, getPostByTitle, searchPosts, updatePostById, deletePostById, getNumberOfPostsByTag } = require('../controllers/post.controller');

router.post('/post', auth, createPost);
router.get('/posts', auth, getPosts);
router.get('/post/title', auth, getPostByTitle);
router.post('/search/post', auth, searchPosts);
router.put('/post/:postId', auth, updatePostById)
router.delete('/post/:postId', auth, deletePostById)
router.get('/number-tags/post', auth, getNumberOfPostsByTag);


module.exports = router;