import { Model, DataTypes } from 'sequelize';
import sequelize from '../services/sequelize';

class Tickets extends Model {}

Tickets.init(
    {
        ticket_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
        },
        showtime_id: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        row: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        column: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        set_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
    },
    {
        sequelize,
        modelName: 'Ticket',
        tableName: 'Tickets',
        timestamps: false,
        allowNull: false,
    },
);

export default Tickets;
