import {Router} from "express";
import {addTransaction, createInvite, getUserByEmail, getUserById} from "../../dataservice.mjs";
import {randomUUID} from "crypto";
import {emailProvider} from "../providers/nodemailer.mjs";
import {inviteLetter} from "../emails/invite.mjs";
import {body, validationResult} from 'express-validator';

export const investorRouter = Router();

investorRouter.all('*', async (req, res, next) => {
    if (req.isAuthenticated() && req.user.RoleId === 1) {
        return res.redirect('/admin')
    } else {
        return next()
    }
})

investorRouter.put('/put',
    body('money').notEmpty().isInt({min: 1}),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const sum = parseInt(req.body.money);
        const user = await getUserById(req.user.id);

        if (sum > 0) {
            await addTransaction(sum, user.id, true);
            res.sendStatus(200);
        } else {
            res.sendStatus(400)
        }
    });

investorRouter.put('/get',
    body('money').notEmpty().isInt({min: 1}),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const user = await getUserById(req.user.id);
        const balance = parseInt(user.balance);
        const sum = parseInt(req.body.money);
        console.log(balance)
        if (balance > 0 && balance >= sum) {
            await addTransaction(-sum, user.id, true);
            res.sendStatus(200);
        } else {
            res.sendStatus(400)
        }
    });

investorRouter.get('/me', async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.json(req.user)
    } else {
        res.sendStatus(403)
    }
});

investorRouter.post('/invite',
    body('email').isEmail().notEmpty().custom(async (email, { req }) => {
        const user = await getUserByEmail(email);
        if (user) {
            console.log(user)
            return false;
        }
        return true;
    }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const email = req.body.email;
        const user = await getUserById(req.user.id);
        const token = randomUUID();
        await createInvite(email, user.id, token);

        const mailData = await inviteLetter(token, email);
        emailProvider.sendMail(mailData);

        res.sendStatus(200);
    })