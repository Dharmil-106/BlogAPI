import prisma from "../db/db.js";

export async function getCommentsForPost(postId) {

    try {
        // prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' } })
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
        });

        return comments;
    } catch (error) {
        throw error;
    }
}

export async function createComment({ postId, content, authorId }) {

    try {
        // verify the post exists and is published before allowing a comment
        const post = await prisma.post.findFirst({ where: { id: postId, published: true } });
        if (!post) {
            throw new Error("Post not found.");
        }

        // prisma.comment.create(...)
        const comment = await prisma.comment.create({
            data: { postId, content, authorId },
        });

        return comment;
    } catch (error) {
        throw error;
    }
}

export async function deleteComment(postId, id, requester) {

    try {
        // fetch comment
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.postId !== postId) {
            throw new Error("Comment not found.");
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });
        const isCommentAuthor = comment.authorId === requester.userId;
        const isPostOwner = post?.authorId === requester.userId;
        if (!isCommentAuthor && !isPostOwner) {
            throw new Error("Unauthorized to delete this comment.");
        }

        await prisma.comment.delete({ where: { id } });
        return true;
    } catch (error) {
        throw error;
    }
}