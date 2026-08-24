import jwt from 'jsonwebtoken';

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
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export function requireRole(role) {
    return (req, res, next) => {
        try {
            // check req.user.role === role, else 403
            if (req.user.role !== role) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            next();
        }
        catch (error) {
            console.error('Error in requireRole:', error);
            return res.status(403).json({ error: 'Forbidden' });
        }
    };
}