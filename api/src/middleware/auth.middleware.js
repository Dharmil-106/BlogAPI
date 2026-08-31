import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError.js';

export function requireAuth(req, res, next) {

    try {
        // read "Authorization: Bearer <token>" header
        const token = req.headers.authorization?.split(' ')[1];

        // jwt.verify(token, process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach decoded payload to req.user
        req.user = decoded;

        // call next(), or 401 on failure
        next();
    }
    catch (error) {
        console.error('Error in requireAuth:', error);
        throw new UnauthorizedError();
    }
}

export function optionalAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            // invalid/expired token — just treat as anonymous, don't block
        }
    }
    next();
}

export function requireRole(role) {
    return (req, res, next) => {
        try {
            // check req.user.role === role, else 403
            if (req.user.role !== role) {
                throw new ForbiddenError();
            }
            next();
        }
        catch (error) {
            console.error('Error in requireRole:', error);
            throw new ForbiddenError();
        }
    };
}