import { Model, DataTypes } from 'sequelize';
import md5 from 'md5';
import fs from 'fs';
import sequelize from '../services/sequelize';
import CreditCard from './creditCard';
import Tickets from './Tickets';
import Reviews from './Reviews';
import _ from 'lodash';
import path from 'path';

const { PASSWORD_SECRET } = process.env;

class Users extends Model {
    static passwordHash = (password) => md5(md5(password) + PASSWORD_SECRET);

    static list = async (page =1, limit = 20) => {
        try {
            const usersList = await Users.findAll();
            const users = _.chunk(usersList, limit)[page - 1] || [];
            const userEmails = users.map(user => user.email);
            return userEmails;
        } catch (e) {
            console.error(e);
            return [];
        }
    };
    static listFile = async () => {
        try {
            const usersList = await Users.findAll();
            const users=usersList.map(user => user.email);
            fs.writeFileSync(path.resolve()+'\\public\\mails\\userEmails.txt', users.join('\n'));

        } catch (e) {
            console.error(e);
            return [];
        }
    };


}

Users.init(
    {
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.CHAR(32),
            allowNull: false,
            set(password) {
                if (password) {
                    this.setDataValue('password', Users.passwordHash(password));
                }
            },
            get() {
                return undefined;
            },
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'active', 'blocked'),
            allowNull: false,
            defaultValue: 'pending',
        },
        activationToken: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                return undefined;
            },
        },
        resetCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: false,
        allowNull: false,
    },
);
Users.hasMany(CreditCard, {
    foreignKey: 'user_id',
    as: 'CreditCard',
});
CreditCard.belongsTo(Users, {
    foreignKey: 'user_id',
});
Users.hasMany(Tickets, {
    foreignKey: 'user_id',
    as: 'Ticket',
});
Tickets.belongsTo(Users, {
    foreignKey: 'user_id',
});
Users.hasMany(Reviews, {
    foreignKey: 'user_id',
    as: 'Rew',
});
Reviews.belongsTo(Users, {
    foreignKey: 'user_id',
});

export default Users;
