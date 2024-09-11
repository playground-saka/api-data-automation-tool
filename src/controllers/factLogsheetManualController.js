import FactLogsheetManualModel from "../models/FactLogsheetManualModel.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import reader from 'xlsx';
import fs from 'fs';
import path from 'path';
import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";
import LogsheetStatusModel from "../models/LogsheetStatusModel.js";
import { toNumberOrZero } from "../utils/helper.js";

// get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const importFactLogsheetManual = async (req, res) => {
  const pelangganId = req.body.pelangganId;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  if (!pelangganId) {
    return res.status(400).json({ error: 'No Pelanggan Id.' });
  }

  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    // read file Excel
    const workbook = reader.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = reader.utils.sheet_to_json(sheet);

    // delete file after process
    fs.unlinkSync(filePath);

    // Save new data to db
    const promises = data.map(async item => { 
      if (item.__EMPTY) {
        const rawDate = item.__EMPTY;
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) {
          console.error(`Invalid date value: ${rawDate}`);
          return; // Skip item with value date not valid
        }

        // add 7 hours (UTC to Local)
        // date.setHours(date.getHours() + 7);

        // get value years, month, days
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // get value hours, minutes, and seconds after 7 hour increments
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // convert value to Y-m-d H:i:s
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const formattedDate = `${year}-${month}-${day}`;
        
        // save data to database
        const logManual = await FactLogsheetManualModel.create({
          dateTime: formattedDateTime,
          pelangganId: pelangganId,
          totalPowerP: toNumberOrZero(item.__EMPTY_1) || 0,
          totalPowerQ: toNumberOrZero(item.__EMPTY_2) || 0,
          powerFactor: toNumberOrZero(item.__EMPTY_3) || 0,
          frequency: toNumberOrZero(item.__EMPTY_4) || 0,
          currentR: toNumberOrZero(item.__EMPTY_5) || 0,
          currentS: toNumberOrZero(item.__EMPTY_6) || 0,
          currentT: toNumberOrZero(item.__EMPTY_7) || 0,
          voltageRS: toNumberOrZero(item.__EMPTY_8) || 0,
          voltageST: toNumberOrZero(item.__EMPTY_9) || 0,
          voltageTR: toNumberOrZero(item.__EMPTY_10) || 0
        });

        // Check if a record exists with the same dateTime
        const existingRecord = await LogsheetManualSistemAggregateModel.findOne({ where: { dateTime: formattedDateTime, pelangganId } });
        if (existingRecord) {
          await existingRecord.update({
            logsheetManualId: logManual.id,
          });
        } else {
          await LogsheetManualSistemAggregateModel.create({
            dateTime: formattedDateTime,
            pelangganId: pelangganId,
            logsheetManualId: logManual.id,
          });
        }

        // Todo : Update data logsheetManual in table logsheet_status
        const logsheetStatus = await LogsheetStatusModel.findOne({ 
            where: { 
                pelangganId:pelangganId, 
                date: formattedDate 
            } 
        });
      
        if (logsheetStatus) {
          await logsheetStatus.update({ logsheetManual: 1 });
        } else {
            console.error('Logsheet status not found for the specified pelangganId and date.');
        }

        return Promise.resolve(); // Resolves for successful operation
      } else {
        return Promise.resolve(); // Resolves for skipped items
      }
    });

    await Promise.all(promises);

    

    res.status(201).json({ message: 'Data processed and inserted successfully!' });
  } catch (error) {
    console.error('Error processing file and inserting data:', error);
    res.status(500).json({ error: 'Error processing file and inserting data.' });
  }
};

// Create
export const createFactLogsheetManual = async (req, res) => {
  try {
    const logsheetManual = await FactLogsheetManualModel.create(req.body);
    res.status(201).json(logsheetManual);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read
export const getFactLogsheetManual = async (req, res) => {
  try {
    const logsheetManual = await FactLogsheetManualModel.findByPk(req.params.id);
    if (logsheetManual) {
      res.status(200).json(logsheetManual);
    } else {
      res.status(404).json({ message: "FactLogsheetManualModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateFactLogsheetManual = async (req, res) => {
  try {
    const logsheetManual = await FactLogsheetManualModel.findByPk(req.params.id);
    if (logsheetManual) {
      await logsheetManual.update(req.body);
      res.status(200).json(logsheetManual);
    } else {
      res.status(404).json({ message: "FactLogsheetManualModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteFactLogsheetManual = async (req, res) => {
  try {
    const logsheetManual = await FactLogsheetManualModel.findByPk(req.params.id);
    if (logsheetManual) {
      await logsheetManual.destroy();
      res.status(204).json({ message: "FactLogsheetManualModel deleted" });
    } else {
      res.status(404).json({ message: "FactLogsheetManualModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
