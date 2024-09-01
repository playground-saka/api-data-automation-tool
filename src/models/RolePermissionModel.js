import { DataTypes } from 'sequelize';
import db from "../configs/database.js";
import RoleModel from './RoleModel.js';
import Permission from './PermissionModel.js';

const RolePermission = db.define('role_permissions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RoleModel,
            key: 'id',
        },
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    tableName: 'role_permissions',
});

RolePermission.belongsTo(RoleModel, { foreignKey: 'roleId' });
RoleModel.hasMany(RolePermission, { foreignKey: 'roleId' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });
Permission.hasMany(RolePermission, { foreignKey: 'permissionId' });

export default RolePermission;
