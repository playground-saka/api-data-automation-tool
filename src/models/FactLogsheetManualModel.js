import { DataTypes } from "sequelize";
import db from "../configs/database.js";
import PelangganModel from "./PelangganModel.js";

const FactLogsheetManualModel = db.define(
  "fact_logsheet_manual",
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
    totalPowerP: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPowerQ: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    powerFactor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    frequency: {
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
    voltageRS: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    voltageST: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    voltageTR: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'fact_logsheet_manual',
  }
);

// Define associations
PelangganModel.hasMany(FactLogsheetManualModel, { foreignKey: "pelangganId" });
FactLogsheetManualModel.belongsTo(PelangganModel, { foreignKey: "pelangganId" });

export default FactLogsheetManualModel;
