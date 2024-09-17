import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";

const ResourceModel = Database.define(
  "resources",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconKey:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasDropdown: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    root: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      afterCreate: async (resource) => {
        if (resource.parentId) {
          const parent = await ResourceModel.findByPk(resource.parentId);
          resource.root = `${parent.root}.${resource.id}`;
          await resource.save();
        } else {
          resource.root = resource.id;
          await resource.save();
        }
      },
    },
    timestamps: true,
    tableName: "resources",
  }
);

ResourceModel.belongsTo(ResourceModel, { foreignKey: "parentId", as: "parent" });
ResourceModel.hasMany(ResourceModel, { foreignKey: "parentId", as: "children" });

export default ResourceModel;
