export function authorizeUser(req, res, next) {
    if (!global.user) {
        return next({
            status : 403,
            message : 'You must log in!'
        });
    }

    if (req.params.userId && req.params.userId !== global.user.userId) {
        return next({
            status : 403,
            message : 'You are not authorized to access this data'
        });
    }

    next();
}