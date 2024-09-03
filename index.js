import express from "express";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import cors from "cors";

import Database from "./src/configs/Database.js";

// Import all models
import "./src/models/UserModel.js";
import "./src/models/RoleModel.js";
import "./src/models/PermissionModel.js";
import "./src/models/UserRoleModel.js";
import "./src/models/RolePermissionModel.js";
import "./src/models/PelangganModel.js";
import "./src/models/FormulaModel.js";
import "./src/models/KategoriModel.js";
import "./src/models/FactLogsheetSistemModel.js";
import "./src/models/FactLogsheetManualModel.js";
import "./src/models/LogsheetStatusModel.js";

dotenv.config();
const app = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);
app.use(express.json()); // Make sure this is before router

// Database connection and synchronization
const startServer = async () => {
  try {
    await Database.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // await Database.sync({ alter: true, force: true }); 
    // console.log("Database Synced");

    app.use(router);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

startServer();
