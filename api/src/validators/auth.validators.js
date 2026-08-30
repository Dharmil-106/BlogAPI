import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string({ message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),

    password: z.string({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),

    name: z.string({ message: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" })
});