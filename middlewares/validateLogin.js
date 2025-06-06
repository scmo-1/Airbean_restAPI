export function validateLogin(req, res, next) {
    const { username, password } = req.body;

    if (!username || username.length < 6) {
        return next({
            status : 400,
            message : 'Username is required and must be at least 6 characters'
        });
    }

    if (!password || password.length < 8) {
        return next({
            status : 400,
            message : 'Password is required and must be at least 8 characters'
        });
    }

    next();
}