import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string({ message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  content: z.string({ message: "Content is required" }),

  bannerImg: z.union([
    z.url({ message: "Invalid banner image URL" }),
    z.literal("")
  ]),

  published: z.boolean().optional()
});

// Same shape reused for updates — CMS always sends the full post object
// on save (single handleSave() for both create and edit), so PUT here
// is a true full-replace, not a partial update.
export const updatePostSchema = createPostSchema;

