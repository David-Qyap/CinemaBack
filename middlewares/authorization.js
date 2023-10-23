import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const { JWT_SECRET } = process.env;

const EXCLUDE = [
    'POST:/users/login',
    'POST:/users/register',
    'GET:/users/activate',
];

export default function authorization(req, res, next) {
    try {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        if (EXCLUDE.includes(`${req.method}:${req.path}`)) {
            next();
            return;
        }

        const token = req.headers.authorization || req.query.token || '';
        const data = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

        if (!data.userId) {
            throw HttpError(401);
        }
        req.userId = data.userId;

        if (req.user && req.user.isAdmin === 1) {
            next(); // Разрешаем доступ к маршрут
        } else {
            throw HttpError(403);
        }
    } catch (e) {
        e.status = 401;
        next(e);
    }
}
