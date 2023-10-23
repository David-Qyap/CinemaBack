import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Category from './Categories';
import Tickets from './Tickets';
import Actor from'./actor';
import Reviews from './Reviews';
import ShowTime from './ShowTime';
import _ from 'lodash';

class Movies extends Model {
    static list = async (page =1, limit = 20,movieList) => {
        try {
            const movies = _.chunk(movieList, limit)[page - 1] || [];
            const moviesData = movies.map(user => user);
            console.log(moviesData);
            return moviesData;
        } catch (e) {
            console.error(e);
            return [];
        }
    };
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
    as: 'categories',
});

Category.belongsToMany(Movies, {
    foreignKey: 'movie_id',
    through: 'MovieCategories',
    as: 'categories',
});
Movies.hasMany(Tickets, {
    foreignKey: 'movie_id',
    as: 'movie_tickets',
});

Tickets.belongsTo(Movies, {
    foreignKey: 'movie_id',
});
Actor.hasMany(Movies, {
    foreignKey: 'movie_id',
    as: 'actors',
});

Movies.belongsToMany(Actor,{
    through: 'MovieActors',
    foreignKey: 'movie_id',
    as: 'actors',
});
Movies.hasMany(Reviews, {
    foreignKey: 'movie_id',
    as: 'reviews'
});

Reviews.belongsTo(Movies, {
    foreignKey: 'movie_id',
    as: 'movie_reviews'
});
Movies.belongsTo(ShowTime, {
    foreignKey: 'movie_id',
    as: 'showtimes',
});
ShowTime.hasMany(Movies, {
    foreignKey: 'movie_id',
    as: 'showtimes',
});
export default Movies;
