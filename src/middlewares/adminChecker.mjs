export const isAdmin = async (req, res, next) => {
    if (req.isAuthenticated() && req.user.RoleId === 1) {
        return next();
    } else {
        res.sendStatus(401);
    }
}
