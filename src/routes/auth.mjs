import {Router} from "express";
import passport from "passport";
import {acceptInvite, addUser, getUserByInvitation} from "../../dataservice.mjs";
import {body, query, validationResult} from 'express-validator';

export const authRouter = Router();

authRouter.post('/signup',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('first_name').isLength({ min: 2 }),
    body('last_name').isLength({ min: 2 }),
    query('token').isUUID(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const token = req.query.token;
        let inviterId = null;
        const {first_name, last_name, email, password} = req.body;

        if (token) {
            const user = await getUserByInvitation(token, email);

            if (!user) {
                res.status(400);
                return res.json("Token is broken");
            }
            inviterId = user.id;
        }

        await addUser({first_name, last_name, password, email, inviterId});

        if (inviterId) {
            await acceptInvite(token, email);
        }

        res.sendStatus(204);
    });

authRouter.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    passport.authenticate('local'),
    (req, res) => {
        res.json(req.user);
    });
