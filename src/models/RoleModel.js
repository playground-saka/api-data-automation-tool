import { DataTypes } from 'sequelize';
import Database from "../configs/Database.js";

const RoleModel = Database.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
    tableName: 'roles',
    
});

export default RoleModel;
