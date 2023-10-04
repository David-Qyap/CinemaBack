import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Category from './Categories';
import Tickets from './Tickets';
import Actor from'./actor';

class Movies extends Model {

}

Movies.init(
  {
    movie_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    trailer_url: {
      type: DataTypes.STRING,
    },
    picture_url: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Movie',
    tableName: 'Movies',
    timestamps: false,
  },
);
Movies.hasMany(Category, {
  foreignKey: 'movie_id',
  as: 'Categories',
});

Category.belongsToMany(Movies, {
  foreignKey: 'movie_id',
  through: 'MovieCategories',
  as: 'Movies',
});
Movies.hasMany(Tickets, {
  foreignKey: 'movie_id',
  as: 'movie_tickets',
});
Tickets.belongsTo(Movies, {
  foreignKey: 'movie_id',
});
Movies.hasMany(Actor, {
    foreignKey: 'movie_id',
    as: 'actors',
});

Actor.belongsToMany(Movies,{
    through: 'MovieActors',
    foreignKey: 'movie_id',
    as: 'actors',
})


export default Movies;
