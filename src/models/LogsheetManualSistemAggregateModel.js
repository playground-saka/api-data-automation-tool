import { DataTypes } from "sequelize";
import Database from "../configs/Database.js";
import PelangganModel from "./PelangganModel.js";
import FactLogsheetManualModel from "./FactLogsheetManualModel.js";

const LogsheetManualSistemAggregateModel = Database.define(
  "logsheet_manual_sistem_aggregate",
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
    logsheetManualId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: FactLogsheetManualModel,
        key: "id",
      },
    },
    currentRHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currentSHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currentTHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    voltageRHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    voltageSHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    voltageTHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    whExportHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    varhExportHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    powerFactorHourly: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    freqDifference: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "logsheet_manual_sistem_aggregate",
  }
);

// Define associations
FactLogsheetManualModel.hasOne(LogsheetManualSistemAggregateModel, {
  foreignKey: "logsheetManualId",
  as: "logsheetManual",
});
LogsheetManualSistemAggregateModel.belongsTo(FactLogsheetManualModel, {
  foreignKey: "logsheetManualId",
  as: "logsheetManual",
});

export default LogsheetManualSistemAggregateModel;
