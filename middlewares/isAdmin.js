export default function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin === 1) {
        next();
    } else {
        res.status(403).send('Доступ запрещен');
    }
}