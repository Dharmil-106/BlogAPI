import prisma from "../db/db.js";
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

export async function getPublishedPosts(requester) {

    try {
        // prisma.post.findMany({ orderBy: { createdAt: 'desc' } })

        const isAuthor = requester?.role === 'AUTHOR';

        const include = { author: { select: { id: true, name: true, pfp: true } } };

        if (isAuthor) {
            return await prisma.post.findMany({ include, orderBy: { createdAt: 'desc' } });
        }
        return await prisma.post.findMany({ where: { published: true }, include, orderBy: { createdAt: 'desc' } });

    } catch (error) {
        console.error("Error in getPublishedPosts:", error);
        throw error;
    }
}

export async function getPostById(id, requester) {

    try {
        // prisma.post.findUnique({ where: { id } })
        // throw if not found
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: { select: { id: true, name: true, pfp: true } } },
        });

        if (!post) {
            throw new NotFoundError("Post not found");
        }

        const isAuthor = requester?.role === 'AUTHOR';

        if (!post.published && !isAuthor) {
            throw new NotFoundError('Post not found');
        }

        return post;
    } catch (error) {
        console.error("Error in getPostById:", error);
        throw error;
    }
}

export async function createPost({ title, content, bannerImg, published, authorId }) {

    try {
        // prisma.post.create(...)
        return await prisma.post.create({
            data: { title, content, bannerImg, published, authorId },
            include: { author: { select: { id: true, name: true, pfp: true } } }
        });

    } catch (error) {
        console.error("Error in createPost:", error);
        throw error;
    }
}

export async function updatePost(id, data, requesterId) {

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) throw new NotFoundError("Post not found");
        if (post.authorId !== requesterId) throw new ForbiddenError("Not your post");

        return await prisma.post.update({
            where: { id },
            data,
            include: { author: { select: { id: true, name: true, pfp: true } } }
        });

    } catch (error) {
        console.error("Error in updatePost:", error);
        throw error;
    }
}

export async function deletePost(id, requesterId) {

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) throw new NotFoundError("Post not found");
        if (post.authorId !== requesterId) throw new ForbiddenError("Not your post");

        return await prisma.post.delete({ where: { id } });

    } catch (error) {
        console.error("Error in deletePost:", error);
        throw error;
    }
}

export async function togglePublish(id, requesterId) {

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) throw new NotFoundError("Post not found");
        if (post.authorId !== requesterId) throw new ForbiddenError("Not your post");

        return await prisma.post.update({
            where: { id },
            data: { published: !post.published },
            include: { author: { select: { id: true, name: true, pfp: true } } }
        });

    } catch (error) {
        console.error("Error in togglePublish:", error);
        throw error;
    }
}