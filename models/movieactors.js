import {DataTypes, Model,} from 'sequelize'
import sequelize from '../services/sequelize.js'




class MovieActors extends Model {

}

MovieActors.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        movie_Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ActorActorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: 'MovieActors',
        tableName: 'MovieActors',
        timestamps: false,
    },
)
export default MovieActors
