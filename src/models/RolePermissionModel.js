import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";
import RoleModel from './RoleModel.js';
import Permission from './PermissionModel.js';

const RolePermission = Database.define('role_permissions', {
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

RoleModel.hasMany(RolePermission, { foreignKey: 'roleId',as:'rolePermissions' });
RoleModel.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId',as: 'permissions' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });
Permission.hasMany(RolePermission, { foreignKey: "permissionId" });
Permission.hasOne(RolePermission, { foreignKey: "permissionId",as:"rolePermission" });

export default RolePermission;
