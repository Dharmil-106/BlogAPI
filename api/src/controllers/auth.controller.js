import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        if(!email || !password || !name){
            return res.status(400).json({ error: 'All fields are required' });
        }

        const token = await registerUser({ email, password, name });
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const token = await loginUser({ email, password });
        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}