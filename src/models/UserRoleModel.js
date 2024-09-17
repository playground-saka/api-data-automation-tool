import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";
import User from './UserModel.js';
import RoleModel from './RoleModel.js';
import UserModel from './UserModel.js';

const UserRoleModel = Database.define('user_roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RoleModel,
            key: 'id',
        },
    },
    assignedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
}, {
    timestamps: true,
    tableName: 'user_roles',
});

UserRoleModel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(UserRoleModel, { foreignKey: 'userId', as: 'userRoles' });

// UserRoleModel.belongsTo(RoleModel, { foreignKey: 'roleId',as: 'role' });

UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: "userId",
  as: "roles",
});
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel, // Name of the join table
  as: "role",
  foreignKey: "userId",
});

RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel, // Name of the join table
  as: "users",
  foreignKey: "roleId", // Foreign key in the join table
});



export default UserRoleModel;
