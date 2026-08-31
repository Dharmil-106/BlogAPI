import { z } from 'zod';

export const authorUpdateSchema = z.object({
    bio: z.string().optional(),
    tagline: z.string().optional(),
    currentFocus: z.string().optional(),

    githubUrl: z.union([
        z.url({ message: "Invalid github url" }),
        z.literal("")
    ]).optional(),

    linkedinUrl: z.union([
        z.url({ message: "Invalid linkedin url" }),
        z.literal("")
    ]).optional(),

    projectLinks: z.array(
        z.object({
            name: z.string(),
            url: z.union([
                z.url({ message: "Invalid project url" }),
                z.literal("")
            ]),
            description: z.string().optional()
        })
    ).optional()
});