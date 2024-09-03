import { DataTypes } from "sequelize";
import Database from "../configs/Database.js";
import PelangganModel from "./PelangganModel.js";

const LogsheetStatusModel = Database.define(
  "fact_logsheet_status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    years: {
      type: DataTypes.STRING,
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
    logsheetManual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    logsheetSistem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'fact_logsheet_status',
  }
);

// Define associations with unique aliases
PelangganModel.hasMany(LogsheetStatusModel, { foreignKey: "pelangganId", as: "logsheetStatuses" });
LogsheetStatusModel.belongsTo(PelangganModel, { foreignKey: "pelangganId", as: "pelanggan" });

export default LogsheetStatusModel;
