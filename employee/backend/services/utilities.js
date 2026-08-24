import jwt from 'jsonwebtoken';

export function getCurrentUser(req) {
    return jwt.decode(req.headers.authorization || req.query.token);
}
