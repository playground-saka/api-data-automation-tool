import { DataTypes } from 'sequelize';
import db from '../configs/database.js';

const UserModel = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'users',
});

export default UserModel;
