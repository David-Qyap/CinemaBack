import { Model, DataTypes } from 'sequelize';
import sequelize from '../services/sequelize';

class Photo extends Model {

}

Photo.init(
    {
        photo_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_name: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'Categories',
        timestamps: false,
    },
);

export default Photo;
