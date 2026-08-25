import * as commentsService from '../services/comments.service.js';

export async function getPostComments(req, res) {
    try {
        const { postId } = req.params;
        const comments = await commentsService.getCommentsForPost(postId);
        res.status(200).json({ comments });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAllComments(req, res) {
    try {
        const comments = await commentsService.getAllComments();
        res.status(200).json({ comments });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
export async function createComment(req, res) {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const authorId = req.user.userId;

        const comment = await commentsService.createComment({ postId, content, authorId });
        res.status(201).json({ comment });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function deleteComment(req, res) {
    try {
        const { postId, id } = req.params;
        await commentsService.deleteComment(postId, id, req.user);
        res.status(200).json({ message: "Comment deleted successfully." });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}