import bcrypt from 'bcrypt';
import db from './models/index.js';
import { Op } from 'sequelize';

export const setup = async () => {
    await db.sequelize.authenticate();
}

/**
 * Method for creating new user in db
 * @param user object with users data
 * @returns {Promise<void>}
 */
export const addUser = async (user) => {
    const passHash = user.password ? await bcrypt.hash(user.password, 10) : null;

    await db.User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: passHash,
        balance: 0,
        RoleId: 2,
        InviterId: user.inviterId
    });
}

/**
 * Method for user authentication
 * @param email users email
 * @param password users password
 * @returns {Promise<boolean|*>}
 */
export const auth = async (email, password) => {
    const user = (await db.User.findOne({
        where: {email: email}
    }))?.toJSON();

    if (!user) {
        return false;
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return false;
    }

    return user;
}

/**
 * Method for getting user by id
 * @param id users id
 * @returns {Promise<*>}
 */
export const getUserById = async (id) => {
    return (await db.User.findOne({
        where: {id},
        include: [
            {model: db.Role},
            {model: db.Transaction}
        ]

    }))?.toJSON();
}

/**
 * Method for getting user by email
 * @param email users email
 * @returns {Promise<Model|null>}
 */
export const getUserByEmail = async (email) => {
    return await db.User.findOne({
        where: { email }
    });
}

/**
 * Method create transaction and add money to investor balance
 * @param sum  money sum
 * @param userId users id in Users table
 * @param invest param which chose between transaction types(investment ar percentage)
 * @returns {Promise<void>}
 */
export const addTransaction = async (sum, userId, invest) => {
    const user = await getUserById(userId);
    const newBalance = parseFloat(user.balance) + parseFloat(sum);
    try {
        await db.sequelize.transaction(async action => {
            await db.Transaction.create({
                'sum': sum,
                'UserId': userId,
                'invest': invest
            }, {transaction: action});

            await db.User.update({balance: newBalance, RoleId: 3}, {
                where: {
                    id: userId
                }, transaction: action
            });
        });
    } catch (e) {
        console.error(e)
    }
}

/**
 * Method for creating invite
 * @param email invited user email
 * @param userId users id, who created invite
 * @param token unique token
 * @returns {Promise<void>}
 */
export const createInvite = async (email, userId, token) => {
    await db.Invite.create({
        email: email,
        token: token,
        UserId: userId,
        accepted: false
    })
}

/**
 * Method for getting user which create invite
 * @param token invitation token
 * @param email invited user email
 * @returns {Promise<null|*>}
 */
export const getUserByInvitation = async (token, email) => {
    const invite = await db.Invite.findOne({
        where: {
            token: token,
            accepted: false,
            email: email
        }
    });

    if (!invite) {
        return null;
    }
    return await getUserById(invite.UserId);
}

/**
 * Method change invite status to accepted and will delete other invites for this email address
 * @param token invitation token
 * @param email invited user email
 * @returns {Promise<void>}
 */
export const acceptInvite = async (token, email) => {
    try {
        await db.sequelize.transaction(async action => {
            await db.Invite.update({accepted: true}, {
                where: {token}
            }, { transaction: action});

            await db.Invite.destroy({
                where: {
                    email: email,
                    token: {
                        [Op.not]: token
                    }
                },
                transaction: action
            })
        });
    } catch (e) {
        console.error(e)
    }
}

/**
 * Method for counting users by role
 * @param roles role id from Role table( can be array like [1,2])
 * @returns {Promise<*>}
 */
export const countUsers = async (roles) => {
    return await db.User.count({
        where: {
            RoleId: roles
        }
    })
}

/**
 * Method for getting sum of all investors money
 * @returns {Promise<*>}
 */
export const getTotalMoney = async () => {
    return await db.User.sum('balance', {
        where: {
            RoleId: [2, 3]
        }
    })
}

/**
 * Method get all investors money and add it to admin balance
 * @param userId id from table users in db
 * @returns {Promise<void>}
 */
export const getAllMoney = async (userId) => {
    const total = await getTotalMoney();
    const adminBalance = await getUserById(userId)

    try {
        await db.sequelize.transaction(async action => {
            await db.User.update({balance: 0}, {
                where: {
                    RoleId: [2, 3]
                }
            }, {transaction: action});

            await db.User.update({balance: (total + adminBalance.balance)}, {
                where: {
                    RoleId: 1
                }, transaction: action
            })
        });
    } catch (e) {
        console.error(e.message);
    }
}

/**
 * Method for getting all investor profiles
 * @returns {Promise<Model[]>}
 */
export const getAllInvestors = async () => {
    return await db.User.findAll({
        where: {
            RoleId: 3
        }
    })
}
