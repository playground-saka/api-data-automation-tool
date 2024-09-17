import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";

const Permission = Database.define(
  "permissions",
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
    asModule: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    root: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      afterCreate: async (permission) => {
        if (permission.parentId) {
          const parent = await Permission.findByPk(permission.parentId);
          permission.root = `${parent.root}.${permission.id}`;
          await permission.save();
        } else {
          permission.root = permission.id;
          await permission.save()
        }
      },
    },
    timestamps: true,
    tableName: "permissions",
  }
);

Permission.belongsTo(Permission, {
  foreignKey: "parentId",
  as: "parent",
});
Permission.hasMany(Permission, {
  foreignKey: "parentId",
  as: "children",
});

export default Permission;
