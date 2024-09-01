import { DataTypes } from 'sequelize';
import db from "../configs/database.js";

const Permission = db.define('permissions', {
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
