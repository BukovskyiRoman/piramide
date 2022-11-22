import PassportLocal from 'passport-local'
import {auth} from "../../../dataservice.mjs";

export const localStrategy = new PassportLocal({
    usernameField: 'email',
    passwordField: 'password',
    //passReqToCallback : true
}, async (email, password, next) => {
    const user = await auth(email, password);

    if (user) {
        return next(null, user);
    }
    next(null, false);
})
