import * as postsService from '../services/posts.service.js';

export async function getAllPosts(req, res) {

    try {
        const posts = await postsService.getPublishedPosts(req.user);
        res.status(200).json({ posts });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getPost(req, res) {

    try {
        const { id } = req.params;
        const post = await postsService.getPostById(id,req.user);
        res.status(200).json({ post });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export async function createPost(req, res) {

    try {
        const { title, content, bannerImg } = req.body;
        const authorId = req.user.userId;
        const post = await postsService.createPost({ title, content, bannerImg, authorId });
        res.status(201).json({ post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function deletePost(req, res) {

    try {
        const { id } = req.params;
        const post = await postsService.deletePost(id, req.user.userId);
        res.status(200).json({ post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function updatePost(req, res) {

    try {
        const { id } = req.params;
        const { title, content, bannerImg } = req.body;
        const post = await postsService.updatePost(id, { title, content, bannerImg }, req.user.userId);
        res.status(200).json({ post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function togglePublish(req, res) {

    try {
        const { id } = req.params;
        const post = await postsService.togglePublish(id, req.user.userId);
        res.status(200).json({ post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}