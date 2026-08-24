import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/db.js';

export async function registerUser({ email, password, name }) {

    try {
        // check if email already exists → throw if so
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // hash password: await bcrypt.hash(password, 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // prisma.user.create(...)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // return a signed JWT: jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return token;
    }
    catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
}

export async function loginUser({ email, password }) {

    try {

        // find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        // if no user OR user.password is null (Google-only account) → throw
        if (!user || !user.password) {
            throw new Error('Try Google Sign-In instead!');
        }

        // bcrypt.compare(password, user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // sign and return JWT same as above
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return token;
    }
    catch (error) {
        console.error('Error in loginUser:', error);
        throw error;
    }
}