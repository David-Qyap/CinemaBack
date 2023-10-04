import { Model, DataTypes } from 'sequelize';
import sequelize from '../services/sequelize';

class Actor extends Model {

}

Actor.init(
    {
        actor_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        actor_name: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Actor',
        tableName: 'Actors',
        timestamps: false,
    }
);

export default Actor;
