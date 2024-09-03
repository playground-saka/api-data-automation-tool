import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";

const Permission = Database.define('permissions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    permissionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
    tableName: 'permissions',
});

export default Permission;
