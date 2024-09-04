import { Op } from "sequelize";
import XLSX from "xlsx";
import FactLogsheetSistemModel from "../models/FactLogsheetSistemModel.js";
import FactLogsheetManualModel from "../models/FactLogsheetManualModel.js";
import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";

export const laporanSistem = async (req, res) => {
  try {
    const { page = 1, per_page = 10, pelanggan_id, date } = req.query;
    const offset = (page - 1) * per_page;
    const whereConditions = {};

    if (pelanggan_id) {
      whereConditions.pelangganId = pelanggan_id;
    }

    if (date) {
      const [month, year] = date.split("-");
      whereConditions.dateTime = {
        [Op.between]: [
          new Date(`${year}-${month}-01T00:00:00.000Z`),
          new Date(`${year}-${month}-31T23:59:59.999Z`),
        ],
      };
    }

    const { count, rows } = await FactLogsheetSistemModel.findAndCountAll({
      where: whereConditions,
      limit: parseInt(per_page),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / per_page);

    res.status(200).json({
      data: rows,
      current_page: parseInt(page),
      per_page: parseInt(per_page),
      total_items: count,
      total_pages: totalPages,
      next_page: page < totalPages ? parseInt(page) + 1 : null,
      prev_page: page > 1 ? parseInt(page) - 1 : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laporanManual = async (req, res) => {
  try {
    const { page = 1, per_page = 10, pelanggan_id, date } = req.query;
    const offset = (page - 1) * per_page;
    const whereConditions = {};

    if (pelanggan_id) {
      whereConditions.pelangganId = pelanggan_id;
    }

    if (date) {
      const [month, year] = date.split("-");
      whereConditions.dateTime = {
        [Op.between]: [
          new Date(`${year}-${month}-01T00:00:00.000Z`),
          new Date(`${year}-${month}-31T23:59:59.999Z`),
        ],
      };
    }

    const { count, rows } = await FactLogsheetManualModel.findAndCountAll({
      where: whereConditions,
      limit: parseInt(per_page),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / per_page);

    res.status(200).json({
      data: rows,
      current_page: parseInt(page),
      per_page: parseInt(per_page),
      total_items: count,
      total_pages: totalPages,
      next_page: page < totalPages ? parseInt(page) + 1 : null,
      prev_page: page > 1 ? parseInt(page) - 1 : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laporanSelisih = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    const { count, rows } =
      await LogsheetManualSistemAggregateModel.findAndCountAll({
        include: [{ model: FactLogsheetManualModel, as: "logsheetManual" }],
        limit: perPage,
        offset: (page - 1) * perPage,
      });

    const formattedData = rows.map((item) => ({
      id: item.id,
      dateTime: item.dateTime,
      pelangganId: item.pelangganId,
      logsheetManualId: item.logsheetManualId,
      currentRHourly: item.currentRHourly,
      currentSHourly: item.currentSHourly,
      currentTHourly: item.currentTHourly,
      voltageRHourly: item.voltageRHourly,
      voltageSHourly: item.voltageSHourly,
      voltageTHourly: item.voltageTHourly,
      whExportHourly: item.whExportHourly,
      varhExportHourly: item.varhExportHourly,
      powerFactorHourly: item.powerFactorHourly,
      freqDifference: item.freqDifference,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      totalPowerPManual: item.logsheetManual.totalPowerP,
      currentRManual: item.logsheetManual.currentR,
      voltageRSManual: item.logsheetManual.voltageRS,
      selisihPowerP: (
        item.whExportHourly - item.logsheetManual.totalPowerP
      ).toFixed(2),
      selisihCurrentR: (
        item.currentRHourly - item.logsheetManual.currentR
      ).toFixed(2),
      selisihVoltageRS: (
        item.voltageRHourly - item.logsheetManual.voltageRS
      ).toFixed(2),
    }));

    const totalPages = Math.ceil(count / perPage);
    const pagination = {
      current_page: page,
      per_page: perPage,
      total_items: count,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    res.status(200).json({
      data: formattedData,
      ...pagination,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const downloadLaporanSelisih = async (req, res) => {
  try {
    const download = req.query.download === "true";
    const { pelanggan_id, date } = req.query;

    if (!pelanggan_id) {
      return res.status(400).json({
        message: "pelanggan_id harus disertakan untuk mengunduh laporan.",
      });
    }

    const whereConditions = {
      pelangganId: pelanggan_id,
    };

    if (date) {
      const [month, year] = date.split("-");
      whereConditions.dateTime = {
        [Op.between]: [
          new Date(`${year}-${month}-01T00:00:00.000Z`),
          new Date(`${year}-${month}-31T23:59:59.999Z`),
        ],
      };
    }

    const { rows } = await LogsheetManualSistemAggregateModel.findAndCountAll({
      include: [{ model: FactLogsheetManualModel, as: "logsheetManual" }],
      where: whereConditions,
    });

    const formattedData = rows.map((item) => {
      const date = new Date(item.dateTime);
      const formattedDate =
        date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) + ` Pukul ${date.toLocaleTimeString("id-ID", { hour12: false })}`;

      return {
        Tanggal: formattedDate,
        "Power P Wilis": item.whExportHourly,
        "Power P Log Manual": item.logsheetManual.totalPowerP,
        "Power P Selisih": (
          item.whExportHourly - item.logsheetManual.totalPowerP
        ).toFixed(2),
        "Current R Wilis": item.currentRHourly,
        "Current R Log Manual": item.logsheetManual.currentR,
        "Current R Selisih": (
          item.currentRHourly - item.logsheetManual.currentR
        ).toFixed(2),
        "Voltage RS Wilis": item.voltageRHourly,
        "Voltage RS Log Manual": item.logsheetManual.voltageRS,
        "Voltage RS Selisih": (
          item.voltageRHourly - item.logsheetManual.voltageRS
        ).toFixed(2),
      };
    });

    if (download) {
      const workbook = XLSX.utils.book_new();

      const headers = [
        ["", "Power P", "", "", "Current R", "", "", "Voltage RS", "", ""],
        [
          "Tanggal",
          "Wilis",
          "Log Manual",
          "Selisih",
          "Wilis",
          "Log Manual",
          "Selisih",
          "Wilis",
          "Log Manual",
          "Selisih",
        ],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(headers);
      XLSX.utils.sheet_add_json(worksheet, formattedData, {
        origin: "A3",
        skipHeader: true,
      });

      worksheet["!merges"] = [
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Selisih");

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="laporan_selisih.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.send(buffer);
    }

    res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laporanGrafikSistem = async (req, res) => {
  try {
    const dataSistem = await FactLogsheetSistemModel.findAndCountAll();

    let monthlyData = new Map();

    dataSistem.rows.forEach((item) => {
      const date = new Date(item.dateTime);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, {
          totalVoltageR: 0,
          totalVoltageS: 0,
          totalVoltageT: 0,
          totalCurrentR: 0,
          totalCurrentS: 0,
          totalCurrentT: 0,
          totalPowerP: 0,
          count: 0,
        });
      }

      const data = monthlyData.get(monthYear);
      data.totalCurrentR += item.currentR;
      data.totalCurrentS += item.currentS;
      data.totalCurrentT += item.currentT;
      data.totalVoltageR += item.voltageR;
      data.totalVoltageS += item.voltageS;
      data.totalVoltageT += item.voltageT;
      data.totalPowerP += item.whExport;
      data.count += 1;
    });

    let resultData = [];

    monthlyData.forEach((data, monthYear) => {
      const averageCurrentS = data.totalCurrentS / data.count;
      const averageCurrentR = data.totalCurrentR / data.count;
      const averageCurrentT = data.totalCurrentT / data.count;

      const averageVoltageS = data.totalVoltageS / data.count;
      const averageVoltageR = data.totalVoltageR / data.count;
      const averageVoltageT = data.totalVoltageT / data.count;

      const averageWhExport = data.totalPowerP / data.count;

      const voltage = (averageVoltageS + averageVoltageR + averageVoltageT) / 3;
      const current = (averageCurrentS + averageCurrentR + averageCurrentT) / 3;

      resultData.push({
        date: monthYear,
        voltage: voltage.toFixed(2),
        current: current.toFixed(2),
        whExport: averageWhExport.toFixed(2),
      });
    });

    res.status(200).json(resultData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laporanGrafikManual = async (req, res) => {
  try {
    const dataManual = await FactLogsheetManualModel.findAndCountAll();

    let monthlyData = new Map();

    dataManual.rows.forEach((item) => {
      const date = new Date(item.dateTime);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, {
          totalVoltageRS: 0,
          totalVoltageST: 0,
          totalVoltageTR: 0,
          totalCurrentR: 0,
          totalCurrentS: 0,
          totalCurrentT: 0,
          totalPowerP: 0,
          count: 0,
        });
      }

      const data = monthlyData.get(monthYear);
      data.totalCurrentR += item.currentR;
      data.totalCurrentS += item.currentS;
      data.totalCurrentT += item.currentT;
      data.totalVoltageRS += item.voltageRS;
      data.totalVoltageST += item.voltageST;
      data.totalVoltageTR += item.voltageTR;
      data.totalPowerP += item.totalPowerP;
      data.count += 1;
    });

    let resultData = [];

    monthlyData.forEach((data, monthYear) => {
      const averageCurrentS = data.totalCurrentS / data.count;
      const averageCurrentR = data.totalCurrentR / data.count;
      const averageCurrentT = data.totalCurrentT / data.count;

      const averageVoltageST = data.totalVoltageST / data.count;
      const averageVoltageRS = data.totalVoltageRS / data.count;
      const averageVoltageTR = data.totalVoltageTR / data.count;

      const averagePowerP = data.totalPowerP / data.count;

      const voltage =
        (averageVoltageST + averageVoltageRS + averageVoltageTR) / 3;
      const current = (averageCurrentS + averageCurrentR + averageCurrentT) / 3;

      resultData.push({
        date: monthYear,
        voltage: voltage.toFixed(2),
        current: current.toFixed(2),
        totalPowerP : averagePowerP.toFixed(2),
      });
    });

    res.status(200).json(resultData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laporanGrafikSelisih = async (req, res) => {
  try {
    const data = await LogsheetManualSistemAggregateModel.findAndCountAll({
      include: [{ model: FactLogsheetManualModel, as: "logsheetManual" }],
    });

    let monthlyData = new Map();

    data.rows.forEach((item) => {
      const date = new Date(item.dateTime);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, {
          totalSelisihPowerP: 0,
          totalSelisihCurrentR: 0,
          totalSelisihVoltageRS: 0,
          count: 0,
        });
      }

      const data = monthlyData.get(monthYear);
      data.totalSelisihPowerP += parseFloat(
        item.whExportHourly - item.logsheetManual.totalPowerP
      );
      data.totalSelisihCurrentR += parseFloat(
        item.currentRHourly - item.logsheetManual.currentR
      );
      data.totalSelisihVoltageRS += parseFloat(
        item.voltageRHourly - item.logsheetManual.voltageRS
      );
      data.count += 1;
    });

    let resultData = [];

    monthlyData.forEach((data, monthYear) => {
      const averageSelisihPowerP = (
        data.totalSelisihPowerP / data.count
      ).toFixed(2);
      const averageSelisihCurrentR = (
        data.totalSelisihCurrentR / data.count
      ).toFixed(2);
      const averageSelisihVoltageRS = (
        data.totalSelisihVoltageRS / data.count
      ).toFixed(2);

      resultData.push({
        date: monthYear,
        selisihPowerP: averageSelisihPowerP,
        selisihCurrentR: averageSelisihCurrentR,
        selisihVoltageRS: averageSelisihVoltageRS,
      });
    });

    res.status(200).json(resultData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
