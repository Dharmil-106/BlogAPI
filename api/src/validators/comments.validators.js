import { z } from "zod";

export const createCommentSchema = z.object({
    content: z.string({ message: "Comment is required" }).min(1, { message: "Comments cannot be empty" }),
});