import * as postsService from '../services/posts.service.js';
import { sendSuccess } from '../utils/sendSuccess.js';

export async function getAllPosts(req, res) {
    const posts = await postsService.getPublishedPosts(req.user);
    sendSuccess(res, { posts });
}

export async function getPost(req, res) {
    const { id } = req.params;
    const post = await postsService.getPostById(id, req.user);
    sendSuccess(res, { post });
}

export async function createPost(req, res) {
    const { title, content, bannerImg, published } = req.body;
    const authorId = req.user.userId;
    const post = await postsService.createPost({ title, content, bannerImg, published, authorId });
    sendSuccess(res, { post }, 201);
}

export async function deletePost(req, res) {
    const { id } = req.params;
    const post = await postsService.deletePost(id, req.user.userId);
    sendSuccess(res, { post });
}

export async function updatePost(req, res) {
    const { id } = req.params;
    const { title, content, bannerImg, published } = req.body;
    const post = await postsService.updatePost(id, { title, content, bannerImg, published }, req.user.userId);
    sendSuccess(res, { post });
}

export async function togglePublish(req, res) {
    const { id } = req.params;
    const post = await postsService.togglePublish(id, req.user.userId);
    sendSuccess(res, { post });
}