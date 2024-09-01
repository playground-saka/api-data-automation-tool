import { DataTypes } from "sequelize";
import db from "../configs/database.js";
import PelangganModel from "./PelangganModel.js";

const FactLogsheetSistemModel = db.define(
  "fact_logsheet_sistem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pelangganId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PelangganModel,
        key: "id",
      },
    },
    voltageR: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    voltageS: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    voltageT: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentR: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentS: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentT: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    powerFactor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    whExport: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    varhExport: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    whImport: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    varhImport: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    watt: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'fact_logsheet_sistem',
  }
);

// Define associations
PelangganModel.hasMany(FactLogsheetSistemModel, { foreignKey: "pelangganId" });
FactLogsheetSistemModel.belongsTo(PelangganModel, { foreignKey: "pelangganId" });

export default FactLogsheetSistemModel;
