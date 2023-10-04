import { Model, DataTypes } from 'sequelize';
import sequelize from '../services/sequelize';

class Category extends Model {

}

Category.init(
  {
    category_id: {
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

export default Category;
