import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";
import ResourceModel from './ResourceModel.js';
import Permission from './PermissionModel.js';

const ResourcePermissionModel = Database.define(
  "resource_permissions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ResourceModel,
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    }
},
  {
    timestamps: true,
    tableName: "resource_permissions",
  }
);

ResourceModel.hasMany(ResourcePermissionModel, {
  foreignKey: "resourceId",
  as: "permissions",
});

export default ResourcePermissionModel;
