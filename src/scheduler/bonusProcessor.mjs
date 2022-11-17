import {addTransaction, getAllInvestors, getUserById} from "../../dataservice.mjs";
import {raw} from "express";

export const bonusProcessor = async () => {
    const investors = await getAllInvestors();

    investors.forEach( (investor) => {
        const profit = investor.balance / 100;
        addProfit(profit, investor);
    })
}

const addProfit = async (sum, user) => {
    await addTransaction(sum, user.id, false);
    const profit = sum / 100;

    if (user.InviterId != null && profit > 0.01) {
        const tempUser = await getUserById(user.InviterId);
        await addProfit( profit,tempUser, false);
    }
}
