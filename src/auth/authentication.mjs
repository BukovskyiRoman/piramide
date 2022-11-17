import passport from 'passport';
import passportSession from 'passport-session';
import {localStrategy} from "./strategies/local.mjs";
import {getUserById} from "../../dataservice.mjs";

export const setupAuth = () => {
    passport.use(passportSession);

    passport.use(localStrategy);

    passport.serializeUser((user, cb) => {
        return cb(null, { id: user.id });
    });

    passport.deserializeUser(async (user, cb) => {
        const tempUser = await getUserById(user.id);
        if (!tempUser) {
            return cb(null, false);
        }
        const { password, ...safeUserData } = tempUser;
        return cb(null, safeUserData);
    });
}
