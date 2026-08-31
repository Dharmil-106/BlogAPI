import * as authorService from '../services/author.service.js';
import { sendSuccess } from '../utils/sendSuccess.js';

export async function getProfile(req, res) {
    const profile = await authorService.getAuthorProfile();
    sendSuccess(res, { author: profile });
}

export async function updateProfile(req, res) {
    const { bio, tagline, currentFocus, githubUrl, linkedinUrl, projectLinks } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (currentFocus !== undefined) updateData.currentFocus = currentFocus;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (projectLinks !== undefined) updateData.projectLinks = projectLinks;

    const profile = await authorService.updateAuthorProfile(req.user.userId, updateData);
    sendSuccess(res, { author: profile });
}
