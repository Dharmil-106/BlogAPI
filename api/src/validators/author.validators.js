import { z } from 'zod';

// Reusable URL schema that restricts to http:// and https:// schemes only.
// z.url() alone accepts javascript:, data:, mailto:, ftp:, etc., which is
// unsafe when rendered into href attributes (stored XSS vector).
const httpUrlSchema = z.url({ message: "URL must be a valid link" })
    .refine((val) => /^https?:\/\//i.test(val), {
        message: "URL must start with http:// or https://"
    });

export const authorUpdateSchema = z.object({
    bio: z.string().optional(),
    tagline: z.string().optional(),
    currentFocus: z.string().optional(),

    githubUrl: z.union([
        httpUrlSchema,
        z.literal("")
    ]).optional(),

    linkedinUrl: z.union([
        httpUrlSchema,
        z.literal("")
    ]).optional(),

    projectLinks: z.array(
        z.object({
            name: z.string(),
            url: z.union([
                httpUrlSchema,
                z.literal("")
            ]),
            description: z.string().optional()
        })
    ).optional()
});