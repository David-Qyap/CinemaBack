import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Tickets from './Tickets';

class Showtime extends Model {

}

Showtime.init(
    {
        showtime_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        movie_id: {
            type: DataTypes.INTEGER,
        },
        date: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: 'Showtime',
        tableName: 'Showtimes',
        timestamps: false,
    },
);

Tickets.belongsTo(Showtime, {
    foreignKey: 'movie_id',
    as: 'Showtime',
});
export default Showtime;
