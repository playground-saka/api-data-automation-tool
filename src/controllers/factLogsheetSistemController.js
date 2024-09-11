import FactLogsheetSistemModel from "../models/FactLogsheetSistemModel.js";
import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import reader from 'xlsx';
import fs from 'fs';
import path from 'path';
import FormulaModel from "../models/FormulaModel.js";
import LogsheetStatusModel from "../models/LogsheetStatusModel.js";
import { toNumberOrZero } from "../utils/helper.js";

// get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const groupByDateAndHour = (data) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.__EMPTY);
    if (isNaN(date.getTime())) return acc; // Skip item with invalid date value

    // Format date as 'Y-m-d H' (e.g., '2024-07-01 00')
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    const groupKey = `${year}-${month}-${day} ${hour}`; // Combine Y-m-d H

    if (!acc[groupKey]) {
      acc[groupKey] = { sumEmpty2: 0, sumEmpty3: 0, sumEmpty4: 0, sumEmpty5: 0, sumEmpty6: 0, sumEmpty7: 0, sumEmpty9: 0, sumEmpty10: 0, sumEmpty11: 0, sumEmpty12: 0, sumEmpty13: 0, count: 0 };
    }

    acc[groupKey].sumEmpty2 += item.__EMPTY_1;
    acc[groupKey].sumEmpty3 += item.__EMPTY_2;
    acc[groupKey].sumEmpty4 += item.__EMPTY_3;
    acc[groupKey].sumEmpty5 += item.__EMPTY_4;
    acc[groupKey].sumEmpty6 += item.__EMPTY_5;
    acc[groupKey].sumEmpty7 += item.__EMPTY_6;
    acc[groupKey].sumEmpty9 += item.__EMPTY_8;
    acc[groupKey].sumEmpty10 += item.__EMPTY_9;
    acc[groupKey].sumEmpty11 += item.__EMPTY_10;
    acc[groupKey].sumEmpty12 += item.__EMPTY_11;
    acc[groupKey].sumEmpty13 += item.__EMPTY_12;
    acc[groupKey].count += 1;

    return acc;
  }, {});
};

// calculate average and transform
const transformData = (groupedData, formula) => {

  const faktorTeganganExpression = formula.faktorTegangan; // e.g, "value * 80 / sqrt(3)"
  const faktorArusExpression = formula.faktorArus; // e.g, "value * 200 * sqrt(3)"
  const faktorPowerExpression = formula.faktorPower; // e.g, "value * 12000"

  // change value dynamics in sqrt dan placeholder value
  const evaluateFaktorTegangan = (value) => {
    // Ekstrak value in sqrt
    const sqrtMatch = faktorTeganganExpression.match(/sqrt\(([^)]+)\)/);
    const sqrtValue = sqrtMatch ? sqrtMatch[1] : '3'; // default 3 if not data

    // change placeholder and sqrt with syntaks js
    const expression = faktorTeganganExpression
      .replace(`sqrt(${sqrtValue})`, `Math.sqrt(${sqrtValue})`)
      .replace('value', value);
    
    // eval ekspresi use Function constructor
    return new Function('return ' + expression)();
  };

    // change value dynamics in sqrt dan placeholder value
    const evaluateFaktorArus = (value) => {
      // Ekstrak value in sqrt
      const sqrtMatch = faktorArusExpression.match(/sqrt\(([^)]+)\)/);
      const sqrtValue = sqrtMatch ? sqrtMatch[1] : '3'; // default 3 if not data
  
      // change placeholder and sqrt with syntaks js
      const expression = faktorArusExpression
        .replace(`sqrt(${sqrtValue})`, `Math.sqrt(${sqrtValue})`)
        .replace('value', value);
      
      // eval ekspresi use Function constructor
      return new Function('return ' + expression)();
    };

    const evaluateFaktorPower = (value) => {
      const expression = faktorPowerExpression
        .replace('value', value);
      
      // eval ekspresi use Function constructor
      return new Function('return ' + expression)();
    };

  return Object.keys(groupedData).map(hourKey => {
    const { sumEmpty2, sumEmpty3, sumEmpty4,sumEmpty5, sumEmpty6, sumEmpty7, sumEmpty9, sumEmpty10, sumEmpty11, sumEmpty12, sumEmpty13, count } = groupedData[hourKey];
    
    const averageEmpty2 = Math.ceil((sumEmpty2 / count) * 100) / 100;
    const averageEmpty3 = Math.ceil((sumEmpty3 / count) * 100) / 100;
    const averageEmpty4 = Math.ceil((sumEmpty4 / count) * 100) / 100;
    const averageEmpty5 = Math.ceil((sumEmpty5 / count) * 100) / 100;
    const averageEmpty6 = Math.ceil((sumEmpty6 / count) * 100) / 100;
    const averageEmpty7 = Math.ceil((sumEmpty7 / count) * 100) / 100;

    const normalizedEmpty9 = Math.ceil((sumEmpty9 / 1000) * 100) / 100;
    const normalizedEmpty10 = Math.ceil((sumEmpty10 / 1000) * 100) / 100;
    const normalizedEmpty11 = Math.ceil((sumEmpty11 / 1000) * 100) / 100;
    const normalizedEmpty12 = Math.ceil((sumEmpty12 / 1000) * 100) / 100;
    const normalizedEmpty13 = Math.ceil((sumEmpty13 / 1000) * 100) / 100;

    const faktorTeganganForEmpty2 = evaluateFaktorTegangan(averageEmpty2);
    const faktorTeganganForEmpty3 = evaluateFaktorTegangan(averageEmpty3);
    const faktorTeganganForEmpty4 = evaluateFaktorTegangan(averageEmpty4);

    const faktorArusForEmpty5 = evaluateFaktorArus(averageEmpty5);
    const faktorArusForEmpty6 = evaluateFaktorArus(averageEmpty6);
    const faktorArusForEmpty7 = evaluateFaktorArus(averageEmpty7);

    const whExportForEmpty9 = evaluateFaktorPower(normalizedEmpty9);
    const varhExportForEmpty10 = evaluateFaktorPower(normalizedEmpty10);
    const whImportForEmpty11 = evaluateFaktorPower(normalizedEmpty11);
    const varhImportForEmpty12 = evaluateFaktorPower(normalizedEmpty12);
    const wattForEmpty13 = evaluateFaktorPower(normalizedEmpty13);

    const voltageR = Math.ceil((faktorTeganganForEmpty2 / 1000) * 100) / 100;
    const voltageS = Math.ceil((faktorTeganganForEmpty3 / 1000) * 100) / 100;
    const voltageT = Math.ceil((faktorTeganganForEmpty4 / 1000) * 100) / 100;

    const currentR = Math.ceil((faktorArusForEmpty5) * 100) / 100;
    const currentS = Math.ceil((faktorArusForEmpty6) * 100) / 100;
    const currentT = Math.ceil((faktorArusForEmpty7) * 100) / 100;

    const whExport = Math.ceil((whExportForEmpty9) * 100) / 100;
    const varhExport = Math.ceil((varhExportForEmpty10) * 100) / 100;
    const whImport = Math.ceil((whImportForEmpty11) * 100) / 100;
    const varhImport = Math.ceil((varhImportForEmpty12) * 100) / 100;
    const watt = Math.ceil((wattForEmpty13) * 100) / 100;

    return {
      hour: hourKey,
      voltageR,
      voltageS,
      voltageT,
      currentR,
      currentS,
      currentT,
      whExport,
      varhExport,
      whImport,
      varhImport,
      watt,
    };
  });
};

// Import Excel
export const importFactLogsheetSistem = async (req, res) => {
  const pelangganId = req.body.pelangganId;

  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diupload.' });
  }

  if (!pelangganId) {
    return res.status(400).json({ message: 'Tidak ada Pelanggan Id.' });
  }

   // Fetch the formula for the customer
   const formula = await FormulaModel.findOne({ where: { pelangganId} });
   if (!formula) {
     return res.status(400).json({ message: 'Formula tidak ditemukan.' });
   }

  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    // Baca file Excel
    const workbook = reader.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = reader.utils.sheet_to_json(sheet);

    // Hapus file setelah diproses
    fs.unlinkSync(filePath);
    
    // Save new data to db
    const promises = data.map(async item => {
      // Check if the row contains valid data by looking for a valid date string
      if (item.__EMPTY && !isNaN(new Date(item.__EMPTY).getTime())) {
        const rawDate = item.__EMPTY;
        const date = new Date(rawDate);
        
        // Add 7 hours (UTC to Local)
        // date.setHours(date.getHours() + 7);

        // Convert date to Y-m-d H:i:s format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const formattedDate = `${year}-${month}-${day}`;

        // Save data to database
        await FactLogsheetSistemModel.create({
          dateTime: formattedDateTime,
          pelangganId: pelangganId,
          voltageR: toNumberOrZero(item.__EMPTY_1) || 0,
          voltageS: toNumberOrZero(item.__EMPTY_2) || 0,
          voltageT: toNumberOrZero(item.__EMPTY_3) || 0,
          currentR: toNumberOrZero(item.__EMPTY_4) || 0,
          currentS: toNumberOrZero(item.__EMPTY_5) || 0,
          currentT: toNumberOrZero(item.__EMPTY_6) || 0,
          powerFactor: toNumberOrZero(item.__EMPTY_7) || 0,
          whExport: toNumberOrZero(item.__EMPTY_8) || 0,
          varhExport: toNumberOrZero(item.__EMPTY_9) || 0,
          whImport: toNumberOrZero(item.__EMPTY_10) || 0,
          varhImport: toNumberOrZero(item.__EMPTY_11) || 0,
          watt: toNumberOrZero(item.__EMPTY_12) || 0
        });
        
         // Todo : Update data logsheetManual in table logsheet_status
        const logsheetStatus = await LogsheetStatusModel.findOne({ 
          where: { 
              pelangganId, 
              date: formattedDate 
          } 
      });
    
      if (logsheetStatus) {
        await logsheetStatus.update({ logsheetSistem: 1 });
      } else {
          console.error('Logsheet status not found for the specified pelangganId and date.');
      }

      } else {
        console.log('Skipping non-data row:', item);
      }
    });

    await Promise.all(promises);

    // Group data by hour
    const groupedData = groupByDateAndHour(data);

    // Transform the grouped data using the formula
    const results = transformData(groupedData, formula);
    updateLogsheetDifference(results, pelangganId);

    res.status(201).json({ message: 'Data processed and inserted successfully!' });
  } catch (error) {
    console.error('Error processing file and inserting data:', error);
    res.status(500).json({ error: 'Error processing file and inserting data.' });
  }
};

const updateLogsheetDifference = async (results, pelangganId) => {
  try {    
    for (const result of results) {
      const localDateTime = `${result.hour}:00:00`;
      const dateTime = new Date(localDateTime);

       // Add 7 hours (UTC to Local)
      // dateTime.setHours(dateTime.getHours() + 7);

       // Convert dateTime to Y-m-d H:i:s format
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const hours = String(dateTime.getHours()).padStart(2, '0');
      const minutes = String(dateTime.getMinutes()).padStart(2, '0');
      const seconds = String(dateTime.getSeconds()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      // Check if a record exists with the same dateTime
      try {
        const existingRecord = await LogsheetManualSistemAggregateModel.findOne(
          {
            where: {
              dateTime: formattedDateTime,
              pelangganId: pelangganId,
            },
          }
        );


        if (existingRecord) {
          // If record exists, update it by summing the existing and new values
          await existingRecord.update({
            voltageRHourly: toNumberOrZero(result.voltageR) || 0,
            voltageSHourly: toNumberOrZero(result.voltageS) || 0,
            voltageTHourly: toNumberOrZero(result.voltageT) || 0,
            currentRHourly: toNumberOrZero(result.currentR) || 0,
            currentSHourly: toNumberOrZero(result.currentS) || 0,
            currentTHourly: toNumberOrZero(result.currentT) || 0,
            whExportHourly: toNumberOrZero(result.whExport) || 0,
            varhExportHourly: toNumberOrZero(result.varhExport) || 0,
            // powerFactorDifference: result.whImport,
            // powerFactorDifference: result.varhImport,
            // powerFactorDifference: result.watt,
          });
        } else {
          await LogsheetManualSistemAggregateModel.create({
            dateTime: formattedDateTime,
            pelangganId: pelangganId,
            voltageRHourly: toNumberOrZero(result.voltageR) || 0,
            voltageSHourly: toNumberOrZero(result.voltageS) || 0,
            voltageTHourly: toNumberOrZero(result.voltageT) || 0,
            currentRHourly: toNumberOrZero(result.currentR) || 0,
            currentSHourly: toNumberOrZero(result.currentS) || 0,
            currentTHourly: toNumberOrZero(result.currentT) || 0,
            whExportHourly: toNumberOrZero(result.whExport) || 0,
            varhExportHourly: toNumberOrZero(result.varhExport) || 0,
            logsheetManualId: null,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    console.log('Logsheet differences updated successfully!');
  } catch (error) {
    console.error('Error updating Logsheet differences:', error);
  }
};


// Create
export const createFactLogsheetSistem = async (req, res) => {
  try {
    const logsheetSistem = await FactLogsheetSistemModel.create(req.body);
    res.status(201).json(logsheetSistem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read
export const getFactLogsheetSistem = async (req, res) => {
  try {
    const logsheetSistem = await FactLogsheetSistemModel.findByPk(req.params.id);
    if (logsheetSistem) {
      res.status(200).json(logsheetSistem);
    } else {
      res.status(404).json({ message: "FactLogsheetSistemModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateFactLogsheetSistem = async (req, res) => {
  try {
    const logsheetSistem = await FactLogsheetSistemModel.findByPk(req.params.id);
    if (logsheetSistem) {
      await logsheetSistem.update(req.body);
      res.status(200).json(logsheetSistem);
    } else {
      res.status(404).json({ message: "FactLogsheetSistemModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteFactLogsheetSistem = async (req, res) => {
  try {
    const logsheetSistem = await FactLogsheetSistemModel.findByPk(req.params.id);
    if (logsheetSistem) {
      await logsheetSistem.destroy();
      res.status(204).json({ message: "FactLogsheetSistemModel deleted" });
    } else {
      res.status(404).json({ message: "FactLogsheetSistemModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
