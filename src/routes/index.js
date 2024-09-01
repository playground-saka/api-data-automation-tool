import express from "express";
import { login, getUsers } from "../controllers/AuthController.js";
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
} from "../controllers/LogsheetStatusController.js";

import AuthMiddleware from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

import {
  laporanSistem,
  laporanManual,
  laporanSelisih,
  downloadLaporanSelisih
} from "../controllers/LaporanController.js";

const router = express.Router();

// Auth routes
router.get("/users", getUsers);
router.post("/login", login);

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

router.get("/laporan-sistem", AuthMiddleware, laporanSistem);
router.get("/laporan-manual", AuthMiddleware, laporanManual);
router.get("/laporan-selisih", AuthMiddleware, laporanSelisih);
router.get("/download-selisih", AuthMiddleware, downloadLaporanSelisih);

export default router;
