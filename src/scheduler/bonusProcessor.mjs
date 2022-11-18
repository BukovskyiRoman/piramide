import {addTransaction, getAllInvestors, getUserById} from "../../dataservice.mjs";

/**
 *
 * Function for getting all investors and for start function which  adding percents to investor balance.
 * @returns {Promise<void>}
 */
export const bonusProcessor = async () => {
    const investors = await getAllInvestors();

    investors.forEach( (investor) => {
        const profit = investor.balance / 100;
        addProfit(profit, investor);
    })
}

/**
 * Recursive function for adding percentage in all levels
 * @param sum profit sum
 * @param user selected investor
 * @returns {Promise<void>}
 */
const addProfit = async (sum, user) => {
    await addTransaction(sum, user.id, false);
    const profit = sum / 10;    // 10% for invited user

    if (user.InviterId != null && profit > 0.01) {
        const tempUser = await getUserById(user.InviterId);
        await addProfit( profit,tempUser);
    }
}
