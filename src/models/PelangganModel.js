import { DataTypes } from "sequelize";
import db from "../configs/database.js";
import DimKategori from "./KategoriModel.js";

const PelangganModel = db.define(
  "pelanggan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pelangganId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaPelanggan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kategoriId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DimKategori,
        key: "id",
      },
    },
    statusPelanggan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'pelanggan',
  }
);

PelangganModel.belongsTo(DimKategori, { foreignKey: "kategoriId", as: "kategori" });
DimKategori.hasMany(PelangganModel, { foreignKey: "kategoriId", as: "pelanggan" });

export default PelangganModel;
