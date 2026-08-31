import * as commentsService from '../services/comments.service.js';
import { sendSuccess } from '../utils/sendSuccess.js';

export async function getPostComments(req, res) {
    const { postId } = req.params;
    const comments = await commentsService.getCommentsForPost(postId);
    sendSuccess(res, { comments });
}

export async function getAllComments(req, res) {
    const comments = await commentsService.getAllComments();
    sendSuccess(res, { comments });
}

export async function createComment(req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const authorId = req.user.userId;

    const comment = await commentsService.createComment({ postId, content, authorId });
    sendSuccess(res, { comment }, 201);
}

export async function deleteComment(req, res) {
    const { postId, id } = req.params;
    await commentsService.deleteComment(postId, id, req.user);
    sendSuccess(res, { message: "Comment deleted successfully." });
}