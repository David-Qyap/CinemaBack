import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Movies from './Movies';
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
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.TIME,
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
Showtime.belongsTo(Movies, {
  foreignKey: 'movie_id',
  as: 'Movie',
});
Tickets.belongsTo(Showtime, {
  foreignKey: 'showtime_id',
  as: 'Showtime',
});
export default Showtime;
