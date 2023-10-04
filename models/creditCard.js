import { Model, DataTypes } from 'sequelize';
import sequelize from '../services/sequelize';

class creditCard extends Model {

}
creditCard.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cardNumber: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{16}$/i,
      },
    },
    cardholderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },

  },
  {
    sequelize,
    modelName: 'creditCard',
    tableName: 'creditCard',
    allowNull: false,
  },
);

export default creditCard;
