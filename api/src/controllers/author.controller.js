import * as authorService from '../services/author.service.js';

export async function getProfile(req, res) {
    try {
        const profile = await authorService.getAuthorProfile();
        res.status(200).json(profile);
    } catch (err) {
        if (err.message === "Author profile not found") {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Database timeout/error: " + err.message });
        }
    }
}

export async function updateProfile(req, res) {
    try {
        const { bio, tagline, githubUrl, linkedinUrl, projectLinks } = req.body;
        
        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (tagline !== undefined) updateData.tagline = tagline;
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
        if (projectLinks !== undefined) updateData.projectLinks = projectLinks;

        const profile = await authorService.updateAuthorProfile(req.user.userId, updateData);
        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
