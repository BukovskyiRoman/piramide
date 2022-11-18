import express from 'express';
import {authRouter} from "./routes/auth.mjs";
import {httpLogger} from "./logger.mjs"
import Redis from "ioredis";
import ConnectRedis from "connect-redis";
import session from 'express-session';
import {setupAuth} from "./auth/authentication.mjs";
import passport from "passport";
import {investorRouter} from "./routes/investor.mjs";
import passportSession from 'passport-session';
import {authMiddleware} from "./auth/authorization.mjs";
import {adminRouter} from "./routes/admin.mjs";
import {isAdmin} from "./middlewares/adminChecker.mjs";
import {setup} from "../dataservice.mjs";
import cron from 'node-cron'
import {bonusProcessor} from "./scheduler/bonusProcessor.mjs";
import {errorHandler} from "./errorHandler.mjs";

const RedisStore = ConnectRedis(session);
const sessionRedisClient = new Redis();

/**
 *
 * @param port
 * @returns {Promise<http.Server<typeof IncomingMessage, typeof ServerResponse>>}
 */
export const createServer = async (port) => {
    const app = express();

    await setup();

    // increasing invest once a day
    cron.schedule('0 10 * * *', async () => {
        await bonusProcessor();
    });

    app.use(httpLogger);
    app.use(express.json());

    app.use(session({
        store: new RedisStore({client: sessionRedisClient}),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
    }));

    passport.use(passportSession);

    setupAuth();

    app.use(passport.authenticate('session'));

    app.use(authRouter);

    app.use(authMiddleware);

    app.use('/invest', investorRouter);

    app.use(isAdmin);

    app.use('/admin', adminRouter);

    app.use(errorHandler);

    return app.listen(port, () => {
        console.log(`Server run on port ${port}`);
    });
}

