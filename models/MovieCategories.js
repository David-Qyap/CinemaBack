import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';

class MovieCategories extends Model {}

MovieCategories.init(
    {
        movieCategoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        movie_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Movies',
                key: 'movie_id',
            },
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories',
                key: 'category_id',
            },
        },
    },
    {
        sequelize,
        modelName: 'MovieCategories',
        tableName: 'MovieCategories',
        timestamps: false,
    }
);

export default MovieCategories;
