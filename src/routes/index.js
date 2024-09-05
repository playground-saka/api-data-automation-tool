import express from "express";
import {
  login,
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../controllers/AuthController.js";
import {
  createFormula,
  getFormulas,
  getFormulaById,
  updateFormula,
  deleteFormula,
} from "../controllers/FormulaController.js";

import {
  createDimPelanggan,
  getAllDimPelanggan,
  getDimPelangganById,
  updateDimPelanggan,
  deleteDimPelanggan,
  getAllPelanggan,
} from "../controllers/PelangganController.js";

import {
  createFactLogsheetManual,
  getFactLogsheetManual,
  updateFactLogsheetManual,
  deleteFactLogsheetManual,
  importFactLogsheetManual,
} from "../controllers/factLogsheetManualController.js";

import {
  createFactLogsheetSistem,
  getFactLogsheetSistem,
  updateFactLogsheetSistem,
  deleteFactLogsheetSistem,
  importFactLogsheetSistem,
} from "../controllers/factLogsheetSistemController.js";

import {
  createLogsheetManualSistemAggregate,
  getLogsheetManualSistemAggregate,
  updateLogsheetManualSistemAggregate,
  deleteLogsheetManualSistemAggregate,
} from "../controllers/LogsheetManualSistemAggregateController.js";

import {
  createDimKategori,
  getDimKategori,
  getDimKategoriById,
  updateDimKategori,
  deleteDimKategori,
} from "../controllers/KategoriController.js";

import {
  createLogsheetStatus,
  getLogsheetStatus,
  detailLogsheetStatus,
  filterLogsheetStatusByDate,
} from "../controllers/LogsheetStatusController.js";

// fix the ERR_MODULE_NOT_FOUND on container
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

import {
  laporanSistem,
  laporanManual,
  laporanSelisih,
  downloadLaporanSelisih,
  laporanGrafikSistem,
  laporanGrafikManual,
  laporanGrafikSelisih,
} from "../controllers/LaporanController.js";

import {
  createRole,
  getAllRole,
  updateRole,
  deleteRole,
} from "../controllers/RoleController.js";

import {
  createRolePermission,
  getRolePermissions,
  deleteRolePermission,
  getRolePermissionById,
  updateRolePermission,
} from "../controllers/RolePermissionController.js";

import {
  createPermission,
  getPermissions,
  deletePermission,
  getPermissionById,
  updatePermission,
} from "../controllers/PermissionController.js";

import {
  createUserRole,
  updateUserRole,
  getUserRoleById,
  getUserRoles,
  deleteUserRole,
} from "../controllers/UserRoleController.js";

const router = express.Router();

// Auth routes
router.get("/users", getUsers);
router.post("/register", createUser);
router.post("/login", login);
router.put("/user/:id", AuthMiddleware, updateUser);
router.delete("/user/:id", AuthMiddleware, deleteUser);

// Formula routes
router.post("/formula", AuthMiddleware, createFormula);
router.get("/formula", AuthMiddleware, getFormulas);
router.get("/formula/:id", AuthMiddleware, getFormulaById);
router.put("/formula/:id", AuthMiddleware, updateFormula);
router.delete("/formula/:id", AuthMiddleware, deleteFormula);

// Dim Pelanggan routes
router.post("/pelanggan", AuthMiddleware, createDimPelanggan);
router.get("/pelanggan", AuthMiddleware, getAllDimPelanggan);
router.get("/pelanggan/:id", AuthMiddleware, getDimPelangganById);
router.put("/pelanggan/:id", AuthMiddleware, updateDimPelanggan);
router.delete("/pelanggan/:id", AuthMiddleware, deleteDimPelanggan);
router.get("/get-all-pelanggan", AuthMiddleware, getAllPelanggan);

// Fact Logsheet Manual routes
router.post("/fact-logsheet-manual", AuthMiddleware, createFactLogsheetManual);
router.post(
  "/import-logsheet-manual",
  AuthMiddleware,
  uploadMiddleware,
  importFactLogsheetManual
);
router.get("/fact-logsheet-manual/:id", AuthMiddleware, getFactLogsheetManual);
router.put(
  "/fact-logsheet-manual/:id",
  AuthMiddleware,
  updateFactLogsheetManual
);
router.delete(
  "/fact-logsheet-manual/:id",
  AuthMiddleware,
  deleteFactLogsheetManual
);

// Fact Logsheet Sistem routes
router.post("/fact-logsheet-sistem", AuthMiddleware, createFactLogsheetSistem);
router.post(
  "/import-logsheet-sistem",
  AuthMiddleware,
  uploadMiddleware,
  importFactLogsheetSistem
);
router.get("/fact-logsheet-sistem/:id", AuthMiddleware, getFactLogsheetSistem);
router.put(
  "/fact-logsheet-sistem/:id",
  AuthMiddleware,
  updateFactLogsheetSistem
);
router.delete(
  "/fact-logsheet-sistem/:id",
  AuthMiddleware,
  deleteFactLogsheetSistem
);

// Logsheet Manual Sistem routes
router.post(
  "/logsheet-manual-sistem-difference",
  AuthMiddleware,
  createLogsheetManualSistemAggregate
);
router.get(
  "/logsheet-manual-sistem-difference/:id",
  AuthMiddleware,
  getLogsheetManualSistemAggregate
);
router.put(
  "/logsheet-manual-sistem-difference/:id",
  AuthMiddleware,
  updateLogsheetManualSistemAggregate
);
router.delete(
  "/logsheet-manual-sistem-difference/:id",
  AuthMiddleware,
  deleteLogsheetManualSistemAggregate
);

router.post("/dim-kategori", createDimKategori);
router.get("/dim-kategori", getDimKategori);
router.get("/dim-kategori/:id", getDimKategoriById);
router.put("/dim-kategori/:id", updateDimKategori);
router.delete("/dim-kategori/:id", deleteDimKategori);

router.post("/logsheet-status", AuthMiddleware, createLogsheetStatus);
router.get("/logsheet-status", AuthMiddleware, getLogsheetStatus);
router.get("/logsheet-status/detail/:id", AuthMiddleware, detailLogsheetStatus);
router.get(
  "/logsheet-status/filter",
  AuthMiddleware,
  filterLogsheetStatusByDate
);

router.get("/laporan-sistem", AuthMiddleware, laporanSistem);
router.get("/laporan-manual", AuthMiddleware, laporanManual);
router.get("/laporan-selisih", AuthMiddleware, laporanSelisih);
router.get("/download-selisih", AuthMiddleware, downloadLaporanSelisih);
router.get("/laporan-grafik-sistem", AuthMiddleware, laporanGrafikSistem);
router.get("/laporan-grafik-manual", AuthMiddleware, laporanGrafikManual);
router.get("/laporan-grafik-selisih", AuthMiddleware, laporanGrafikSelisih);

// Role routes
router.post("/role", AuthMiddleware, createRole);
router.get("/role", AuthMiddleware, getAllRole);
router.put("/role/:id", AuthMiddleware, updateRole);
router.delete("/role/:id", AuthMiddleware, deleteRole);

// Role Permission routes
router.post("/role-permission", AuthMiddleware, createRolePermission);
router.get("/role-permission", AuthMiddleware, getRolePermissions);
router.get("/role-permission/:id", AuthMiddleware, getRolePermissionById);
router.put("/role-permission/:id", AuthMiddleware, updateRolePermission);
router.delete("/role-permission/:id", AuthMiddleware, deleteRolePermission);

// Permission routes
router.post("/permission", AuthMiddleware, createPermission);
router.get("/permission", AuthMiddleware, getPermissions);
router.get("/permission/:id", AuthMiddleware, getPermissionById);
router.put("/permission/:id", AuthMiddleware, updatePermission);
router.delete("/permission/:id", AuthMiddleware, deletePermission);

// User Role routes
router.post("/user-role", AuthMiddleware, createUserRole);
router.get("/user-role", AuthMiddleware, getUserRoles);
router.get("/user-role/:id", AuthMiddleware, getUserRoleById);
router.put("/user-role/:id", AuthMiddleware, updateUserRole);
router.delete("/user-role/:id", AuthMiddleware, deleteUserRole);

export default router;
