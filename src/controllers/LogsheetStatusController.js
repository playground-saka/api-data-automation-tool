import LogsheetStatusModel from "../models/LogsheetStatusModel.js";
import PelangganModel from "../models/PelangganModel.js";
import KategoriModel from "../models/KategoriModel.js";
import { Op } from 'sequelize';

export const getLogsheetStatusOld = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const date = req.query.date;

    const offset = (page - 1) * perPage;

    const queryOptions = {
      attributes: { exclude: ["pelangganId"] },
      include: [
        {
          model: PelangganModel,
          as: "pelanggan",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: KategoriModel,
              as: "kategori",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      limit: perPage,
      offset: offset,
    };

    if (date) {
      const [month, year] = date.split("-");
      if (
        !month ||
        !year ||
        isNaN(month) ||
        isNaN(year) ||
        month.length !== 2 ||
        year.length !== 4
      ) {
        return res
          .status(400)
          .json({ message: "Invalid date format. Use MM-YYYY format." });
      }

      queryOptions.where = {
        month,
        years: year,
      };
    }

    const { count, rows } = await LogsheetStatusModel.findAndCountAll(
      queryOptions
    );

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.json({
      data: rows,
      current_page: page,
      per_page: perPage,
      total_items: totalItems,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    });
  } catch (error) {
    console.error("Error fetching logsheet statuses:", error);
    res.status(500).json({ message: "Error fetching logsheet statuses" });
  }
};

export const getLogsheetStatus = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const date = req.query.date; 

    const offset = (page - 1) * perPage;

    const whereClause = search
      ? {
          [Op.or]: [
            { '$pelanggan.namaPelanggan$': { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const queryOptions = {
      where: whereClause,
      attributes: { exclude: ["pelangganId"] },
      include: [
        {
          model: PelangganModel,
          as: "pelanggan",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: KategoriModel,
              as: "kategori",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      limit: perPage,
      offset: offset,
    };

    if (date) {
      const [month, year] = date.split("-");
      if (
        !month ||
        !year ||
        isNaN(month) ||
        isNaN(year) ||
        month.length !== 2 ||
        year.length !== 4
      ) {
        return res
          .status(400)
          .json({ message: "Invalid date format. Use MM-YYYY format." });
      }

      queryOptions.where = {
        ...queryOptions.where,
        month,
        years: year,
      };
    }

    const { count, rows } = await LogsheetStatusModel.findAndCountAll(
      queryOptions
    );

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.json({
      data: rows,
      current_page: page,
      per_page: perPage,
      total_items: totalItems,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    });
  } catch (error) {
    console.error("Error fetching logsheet statuses:", error);
    res.status(500).json({ error: "Error fetching logsheet statuses" });
  }
};

export const detailLogsheetStatus = async (req, res) => {
  try {
    const logsheetStatus = await LogsheetStatusModel.findByPk(req.params.id, {
      attributes: { exclude: ["pelangganId", "createdAt", "updatedAt"] },
      include: [
        {
          model: PelangganModel,
          as: "pelanggan",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: KategoriModel,
              as: "kategori",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
    });

    if (logsheetStatus) {
      res.json(logsheetStatus);
    } else {
      res.status(404).json({ message: "Logsheet status not found" });
    }
  } catch (error) {
    console.error("Error fetching logsheet status:", error);
    res.status(500).json({ message: "Error fetching logsheet status" });
  }
};

export const createLogsheetStatus = async (req, res) => {
  try {
    const { fullDate, logsheetManual, logsheetSistem } = req.body;

    const [years, month] = fullDate.split("-");

    const pelanggans = await PelangganModel.findAll({
      where: {
        statusPelanggan: true,
      },
      attributes: ["id", "pelangganId"],
    });

    const existingLogsheets = await LogsheetStatusModel.findAll({
      where: {
        month,
        years,
      },
    });

    if (existingLogsheets.length > 0) {
      return res.status(400).json({
        message: `Logsheet untuk bulan ${month} dan tahun ${years} sudah ada`,
      });
    }

    const logsheetStatuses = await Promise.all(
      pelanggans.map(async (pelanggan) => {
        // Cek logsheet status has data where pelangganId, month, dan years
        const existingLogsheetStatus = await LogsheetStatusModel.findOne({
          where: {
            pelangganId: pelanggan.id,
            month,
            years,
          },
        });

        // if has data, skip this pelanggan
        if (existingLogsheetStatus) {
          res.status(409).json({ message: "Logsheet sudah ada" });
        }

        return await LogsheetStatusModel.create({
          date: fullDate,
          month,
          years,
          pelangganId: pelanggan.id,
          logsheetManual,
          logsheetSistem,
        });
      })
    );

    res.status(201).json(logsheetStatuses);
  } catch (error) {
    res.status(500).json({ message: "Error creating logsheet status", error });
  }
};

export const updateLogsheetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, pelangganId, logsheetManual, logsheetSistem } = req.body;

    const [years, month] = date.split("-");

    const [updated] = await LogsheetStatusModel.update(
      { date, month, years, pelangganId, logsheetManual, logsheetSistem },
      { where: { id } }
    );
    if (updated) {
      const updatedLogsheetStatus = await LogsheetStatusModel.findByPk(id);
      res.status(200).json(updatedLogsheetStatus);
    } else {
      res.status(404).json({ message: "Logsheet status not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating logsheet status", error });
  }
};

export const filterLogsheetStatusByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const [month, year] = date.split("-");

    if (
      !month ||
      !year ||
      isNaN(month) ||
      isNaN(year) ||
      month.length !== 2 ||
      year.length !== 4
    ) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use MM-YYYY format." });
    }

    const logsheetStatuses = await LogsheetStatusModel.findAll({
      where: {
        month,
        years: year,
      },
      include: [
        {
          model: PelangganModel,
          as: "pelanggan",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: KategoriModel,
              as: "kategori",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
    });

    if (logsheetStatuses.length === 0) {
      return res.status(404).json({
        message: "No logsheet found for the specified month and year",
      });
    }

    res.json(logsheetStatuses);
  } catch (error) {
    console.error("Error fetching logsheet statuses by date:", error);
    res.status(500).json({ message: "Error fetching logsheet statuses" });
  }
};
