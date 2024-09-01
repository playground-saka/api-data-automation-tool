import FormulaModel from "../models/FormulaModel.js";
import PelangganModel from "../models/PelangganModel.js";

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
export const getFormulas = async (req, res) => {
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
    const { faktorArus, faktorTegangan } = req.body;
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
