import { DataTypes } from "sequelize";
import Database from "../configs/Database.js";
import PelangganModel from "./PelangganModel.js";

const FormulaModel = Database.define(
  "formula",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pelangganId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PelangganModel,
        key: "id",
      },
      unique: true, 
    },
    faktorArus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faktorTegangan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faktorPower: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'formula',
  }
);

PelangganModel.hasOne(FormulaModel, { foreignKey: 'pelangganId', as: 'pelanggan' });
FormulaModel.belongsTo(PelangganModel, { foreignKey: 'pelangganId', as: 'pelanggan' });

export default FormulaModel;
