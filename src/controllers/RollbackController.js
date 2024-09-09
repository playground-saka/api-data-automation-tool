import FactLogsheetManualModel from "../models/FactLogsheetManualModel.js";
import FactLogsheetSistemModel from "../models/FactLogsheetSistemModel.js";
import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";
import { Op } from 'sequelize';

const processRollbackManual = async (pelangganId, startDate, endDate, res) => {
    const existingLogsheets = await FactLogsheetManualModel.findAll({
        where: {
            pelangganId,
            dateTime: {
            [Op.between]: [startDate, endDate] // All datetimes in the month
            }
        }
    });
    
    if (existingLogsheets.length === 0) {
        return res.status(404).json({ message: "Tidak ada logsheet yang ditemukan untuk rentang tanggal yang ditentukan" });
    }

    // Get all IDs from found logsheets Manual
    const ids = existingLogsheets.map(logsheet => logsheet.id);

    const logsheetManualSistem =  await LogsheetManualSistemAggregateModel.findAll({
        where: {
            logsheetManualId: {
                [Op.in]: ids
            }
        }
    });

    // Loop through each record and check the conditions
    for (let logsheet of logsheetManualSistem) {
        const {
            id,
            currentRHourly,
            currentSHourly,
            currentTHourly,
            voltageRHourly,
            voltageSHourly,
            voltageTHourly,
            whExportHourly,
            varhExportHourly
        } = logsheet;

        if (
            currentRHourly || currentSHourly || currentTHourly ||
            voltageRHourly || voltageSHourly || voltageTHourly ||
            whExportHourly || varhExportHourly
        ) {
            // If any of the fields have values, update logsheetManualId to null
            await LogsheetManualSistemAggregateModel.update(
                { logsheetManualId: null },
                {
                    where: {
                        pelangganId,
                        id: id // Only update the specific logsheet
                    }
                }
            );
        } else {
            // If none of the fields have values, delete the record
            await LogsheetManualSistemAggregateModel.destroy({
                where: {
                    pelangganId,
                    id: id // Only delete the specific logsheet
                }
            });
        }
    }

    // Delete all existing logsheets
    const destroyLogsheetManual = await FactLogsheetManualModel.destroy({
        where: {
            pelangganId,
            dateTime: {
                [Op.between]: [startDate, endDate]
            }
        }
    });

    return destroyLogsheetManual;
};

const processRollbackSistem = async (pelangganId, startDate, endDate, res) => {
    const logsheetManualSistem =  await LogsheetManualSistemAggregateModel.findAll({
        where: {
            pelangganId,
            dateTime: {
                [Op.between]: [startDate, endDate]
            }
        }
    });

    if (logsheetManualSistem.length === 0) {
        return res.status(404).json({ message: "Tidak ada logsheet yang ditemukan untuk rentang tanggal yang ditentukan" });
    }

    // Loop through each record and check the conditions
    for (let logsheet of logsheetManualSistem) {
        const {
            id,
            logsheetManualId,
        } = logsheet;

        if (
            logsheetManualId 
        ) {
            // If any of the fields have values, update logsheetManualId to null
            await LogsheetManualSistemAggregateModel.update(
                { currentRHourly: null },
                { currentSHourly: null },
                { currentTHourly: null },
                { voltageRHourly: null },
                { voltageSHourly: null },
                { voltageTHourly: null },
                { whExportHourly: null },
                { varhExportHourly: null },
                {
                    where: {
                        pelangganId,
                        id: id // Only update the specific logsheet
                    }
                }
            );
        } else {
            // If none of the fields have values, delete the record
            await LogsheetManualSistemAggregateModel.destroy({
                where: {
                    pelangganId,
                    id: id // Only delete the specific logsheet
                }
            });
        }
    }

    // Delete all existing logsheets
    const destroyLogsheetSistem = await FactLogsheetSistemModel.destroy({
        where: {
            pelangganId,
            dateTime: {
                [Op.between]: [startDate, endDate]
            }
        }
    });

    return destroyLogsheetSistem;
};

// Process Rollback
export const processRollback = async (req, res) => {
    try {
        const { date, pelangganId, type } = req.body;

        if (!date || !pelangganId) return res.status(400).json({ message: "date and pelangganId are required" });

        const startDate = new Date(`${date}-01T00:00:00`); // Start of the month
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1); // Move to the next month

        const rollbackProcess = type === 'manual' ? processRollbackManual : processRollbackSistem;

        const destroyLogsheet = await rollbackProcess(pelangganId, startDate, endDate, res);

        res.status(destroyLogsheet ? 200 : 404).json({
            message: destroyLogsheet ? "Logsheet Berhasil di Rollback" : "Logsheet Gagal di Rollback"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

