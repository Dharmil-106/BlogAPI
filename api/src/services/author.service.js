import prisma from "../db/db.js";
import { NotFoundError } from '../errors/AppError.js';

export async function getAuthorProfile() {
    try {
        const author = await prisma.user.findFirst({
            where: { role: 'AUTHOR' },
            select: {
                name: true,
                bio: true,
                tagline: true,
                currentFocus: true,
                githubUrl: true,
                linkedinUrl: true,
                projectLinks: true,
                pfp: true
            }
        });
        
        if (!author) {
            throw new NotFoundError("Author profile not found");
        }
        
        return author;
    } catch (error) {
        console.error("Error in getAuthorProfile:", error);
        throw error;
    }
}

export async function updateAuthorProfile(userId, updateData) {
    try {
        const author = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                name: true,
                bio: true,
                tagline: true,
                currentFocus: true,
                githubUrl: true,
                linkedinUrl: true,
                projectLinks: true,
                pfp: true
            }
        });
        
        return author;
    } catch (error) {
        console.error("Error in updateAuthorProfile:", error);
        throw error;
    }
}
