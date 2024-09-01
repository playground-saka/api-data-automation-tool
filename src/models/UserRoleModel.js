import { DataTypes } from 'sequelize';
import db from "../configs/database.js";
import User from './UserModel.js';
import RoleModel from './RoleModel.js';

const UserRoleModel = db.define('user_roles', {
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
    },
}, {
    timestamps: true,
    tableName: 'user_roles',
});

UserRoleModel.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserRoleModel, { foreignKey: 'userId' });

UserRoleModel.belongsTo(RoleModel, { foreignKey: 'roleId' });
RoleModel.hasMany(UserRoleModel, { foreignKey: 'roleId' });

export default UserRoleModel;
