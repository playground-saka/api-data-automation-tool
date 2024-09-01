import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";

// Create
export const createLogsheetManualSistemAggregate = async (req, res) => {
  try {
    const logsheetSistem = await LogsheetManualSistemAggregateModel.create(req.body);
    res.status(201).json(logsheetSistem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read
export const getLogsheetManualSistemAggregate = async (req, res) => {
  try {
    const logsheetSistem = await LogsheetManualSistemAggregateModel.findByPk(req.params.id);
    if (logsheetSistem) {
      res.status(200).json(logsheetSistem);
    } else {
      res.status(404).json({ message: "LogsheetManualSistemAggregateModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateLogsheetManualSistemAggregate = async (req, res) => {
  try {
    const logsheetSistem = await LogsheetManualSistemAggregateModel.findByPk(req.params.id);
    if (logsheetSistem) {
      await logsheetSistem.update(req.body);
      res.status(200).json(logsheetSistem);
    } else {
      res.status(404).json({ message: "LogsheetManualSistemAggregateModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteLogsheetManualSistemAggregate = async (req, res) => {
  try {
    const logsheetSistem = await LogsheetManualSistemAggregateModel.findByPk(req.params.id);
    if (logsheetSistem) {
      await logsheetSistem.destroy();
      res.status(204).json({ message: "LogsheetManualSistemAggregateModel deleted" });
    } else {
      res.status(404).json({ message: "LogsheetManualSistemAggregateModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
