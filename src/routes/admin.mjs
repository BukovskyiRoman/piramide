import {Router} from "express";
import {countUsers, getAllMoney, getTotalMoney} from "../../dataservice.mjs";

export const adminRouter = Router();

/**
 * Method for displaying startup statistic
 */
adminRouter.get('/', async (req, res, next) => {
    const users = await countUsers([2,3]);
    const investors = await countUsers([3])
    let  total = await getTotalMoney();

    total = total ? total : 0;

    res.json({
        'allUsers': users,
        'investors': investors,
        'balance': total
    })
});

/**
 * Method for get all money from investor accounts
 */
adminRouter.patch('/get', async (req, res, next) => {
    await getAllMoney(req.user.id);
    res.status(200);
    res.json('You are rich');
});



