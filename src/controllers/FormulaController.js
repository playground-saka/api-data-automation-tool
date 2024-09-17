import FormulaModel from "../models/FormulaModel.js";
import PelangganModel from "../models/PelangganModel.js";
import { Op } from "sequelize";

// Create a new FormulaModel
export const createFormula = async (req, res) => {
  try {
    const { pelangganId, faktorArus, faktorTegangan, faktorPower } =
      req.body;

    const pelanggan = await PelangganModel.findByPk(pelangganId);
    if (!pelanggan) {
      return res.status(404).json({ message: "PelangganModel not found" });
    }

    // Create the formula
    const formula = await FormulaModel.create({
      pelangganId,
      faktorArus,
      faktorTegangan,
      faktorPower,
    });
    res.status(201).json(formula);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all FormulaModel records
export const getAllFormulas = async (req, res) => {
  try {
    const formulas = await FormulaModel.findAll({
      include: [{
        model: PelangganModel,
        as: 'pelanggan' 
      }]
    });
    res.status(200).json(formulas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Formula With Pagination
export const getFormulas = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const offset = (page - 1) * perPage;
    
    const whereClause = search
    ? {
        [Op.or]: [
          { '$pelanggan.namaPelanggan$': { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

    const { count, rows: formulaList } = await FormulaModel.findAndCountAll({
      where: whereClause,
      include: [{
        model: PelangganModel,
        as: 'pelanggan' 
      }],
      limit: perPage,
      offset: offset,
    });

    const totalPages = Math.ceil(count / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      data: formulaList,
      current_page: page,
      per_page: perPage,
      total_items: count,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFormulaById = async (req, res) => {
  try {
    const formula = await FormulaModel.findByPk(req.params.id);
    if (formula) {
      res.status(200).json(formula);
    } else {
      res.status(404).json({ message: "FormulaModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a FormulaModel record by ID
export const updateFormula = async (req, res) => {
  try {
    const { faktorArus, faktorTegangan, faktorPower } = req.body;
    const formula = await FormulaModel.findByPk(req.params.id);
    if (formula) {
      formula.faktorArus = faktorArus;
      formula.faktorTegangan = faktorTegangan;
      formula.faktorPower = faktorPower;
      await formula.save();
      res.status(200).json(formula);
    } else {
      res.status(404).json({ message: "FormulaModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a FormulaModel record by ID
export const deleteFormula = async (req, res) => {
  try {
    const formula = await FormulaModel.findByPk(req.params.id);
    if (formula) {
      await formula.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ message: "FormulaModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
