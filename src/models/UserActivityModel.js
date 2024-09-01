import { DataTypes } from 'sequelize';
import db from "../configs/database.js";
import User from './UserModel.js';

const UserActivityModel = db.define('user_activity', {
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
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    params: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    meta: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: 'user_activity',
});

UserActivityModel.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserActivityModel, { foreignKey: 'userId' });

export default UserActivityModel;
