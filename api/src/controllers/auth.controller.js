import { registerUser, loginUser, loginWithGoogle, getUserById } from '../services/auth.service.js';
import { sendSuccess } from '../utils/sendSuccess.js';

export async function register(req, res) {
    const { email, password, name } = req.body;
    const token = await registerUser({ email, password, name });
    sendSuccess(res, { token }, 201);
}

export async function login(req, res) {
    const { email, password } = req.body;
    const token = await loginUser({ email, password });
    sendSuccess(res, { token });
}

export async function googleLogin(req, res) {
    const { credential } = req.body;
    const token = await loginWithGoogle(credential);
    sendSuccess(res, { token });
}

export const getMe = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.userId);
        return sendSuccess(res, user);
    } catch (err) {
        next(err);
    }
};