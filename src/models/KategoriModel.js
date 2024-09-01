import { DataTypes } from "sequelize";
import db from "../configs/database.js";

const KategoriModel = db.define(
    "kategori",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        namaKategori: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusKategori: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "kategori",
    }
);

export default KategoriModel;
