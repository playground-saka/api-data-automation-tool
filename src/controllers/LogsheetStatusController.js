import LogsheetStatusModel from "../models/LogsheetStatusModel.js";
import PelangganModel from "../models/PelangganModel.js";
import KategoriModel from "../models/KategoriModel.js";

export const getLogsheetStatus = async (req, res) => {
  try {

    const page = parseInt(req.query.page, 10) || 1; 
    const perPage = parseInt(req.query.per_page, 10) || 10; 


    const offset = (page - 1) * perPage;

    // Fetch logsheet statuses with pagination
    const { count, rows } = await LogsheetStatusModel.findAndCountAll({
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
    });

    // Calculate pagination metadata
    const totalItems = count;
    const totalPages = Math.ceil(totalItems / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    // Send response with formatted data
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

export const createLogsheetStatus = async (req, res) => {
  try {
    const { fullDate, pelangganId, logsheetManual, logsheetSistem } = req.body;

    const [years, month, date] = fullDate.split("-");

    const pelanggans = await PelangganModel.findAll({
      attributes: ["id", "pelangganId"],
    });

    // Loop through each pelanggan and create a LogsheetStatusModel entry
    const logsheetStatuses = await Promise.all(
      pelanggans.map(async (pelanggan) => {
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
