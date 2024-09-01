import { DataTypes } from 'sequelize';
import db from "../configs/database.js";

const RoleModel = db.define('roles', {
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
