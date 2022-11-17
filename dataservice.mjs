import bcrypt from 'bcrypt';
import db from './models/index.js';
import { Op } from 'sequelize';

export const setup = async () => {
    await db.sequelize.authenticate();
}

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

export const getUserById = async (id) => {
    return (await db.User.findOne({
        where: {id},
        include: [
            {model: db.Role},
            {model: db.Transaction}
        ]

    }))?.toJSON();
}

export const getUserByEmail = async (email) => {
    return await db.User.findOne({
        where: { email }
    });
}

export const addTransaction = async (sum, userId, invest) => {
    const user = await getUserById(userId);
    const newBalance = parseInt(user.balance) + parseInt(sum);
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

export const createInvite = async (email, userId, token) => {
    await db.Invite.create({
        email: email,
        token: token,
        UserId: userId,
        accepted: false
    })
}

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

export const countUsers = async (roles) => {
    return await db.User.count({
        where: {
            RoleId: roles
        }
    })
}

export const getTotalMoney = async () => {
    return await db.User.sum('balance', {
        where: {
            RoleId: [2, 3]
        }
    })
}

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

export const getAllInvestors = async () => {
    return await db.User.findAll({
        where: {
            RoleId: 3
        }
    })
}
