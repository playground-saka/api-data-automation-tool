import { DataTypes } from 'sequelize';
import Database from '../configs/Database.js';
// import { user } from 'pg/lib/defaults.js';

const UserModel = Database.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullName: {
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
