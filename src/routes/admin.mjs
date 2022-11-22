import {Router} from "express";
import {countUsers, getAllMoney, countTotalMoney} from "../../dataservice.mjs";

export const adminRouter = Router();

/**
 * Method for displaying startup statistic
 */
adminRouter.get('/', async (req, res, next) => {
    res.json({
        'allUsers': await countUsers(['investor', 'user']),
        'investors': await countUsers(['investor']),
        'balance': await countTotalMoney()
    })
});

/**
 * Method for get all money from investor accounts
 */
adminRouter.patch('/get', async (req, res, next) => {
    await getAllMoney(req.user.id);
    res.status(200);
    res.json('You are rich!!!');
});



