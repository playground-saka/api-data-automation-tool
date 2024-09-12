import PelangganModel from "../models/PelangganModel.js";
import DimKategori from "../models/KategoriModel.js";

// Create
export const createDimPelanggan = async (req, res) => {
  try {
    const { namaPelanggan, kategoriId, statusPelanggan, pelangganId } =
      req.body;

    if (!kategoriId || !statusPelanggan) {
      return res.status(400).json({
        message: "kategoriId and statusPelanggan are required",
      });
    }

    const pelanggan = await PelangganModel.create({
      namaPelanggan,
      pelangganId,
      kategoriId,
      statusPelanggan,
    });
    res.status(201).json(pelanggan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all data
export const getAllPelanggan = async (req, res) => {
  try {
    const pelanggan = await PelangganModel.findAll({
      attributes: {
        exclude: ["kategoriId", "createdAt", "updatedAt"],
      },
    });
    res.status(200).json(pelanggan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read with pagination
export const getAllDimPelanggan = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const offset = (page - 1) * perPage;

    const { count, rows: pelangganList } = await PelangganModel.findAndCountAll(
      {
        include: [
          {
            model: DimKategori,
            attributes: ["id", "namaKategori", "statusKategori"],
            as: "kategori",
          },
        ],
        attributes: ["id", "pelangganId", "namaPelanggan", "statusPelanggan"],
        limit: perPage,
        offset: offset,
        order: [['id', 'ASC']],
      }
    );

    const totalPages = Math.ceil(count / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      data: pelangganList.map((pelanggan) => ({
        id: pelanggan.id,
        pelangganId: pelanggan.pelangganId,
        namaPelanggan: pelanggan.namaPelanggan,
        kategori: {
          id: pelanggan.kategori.id,
          namaKategori: pelanggan.kategori.namaKategori,
          statusKategori: pelanggan.kategori.statusKategori,
        },
        statusPelanggan: pelanggan.statusPelanggan,
      })),
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

// Read one
export const getDimPelangganById = async (req, res) => {
  try {
    const pelanggan = await PelangganModel.findByPk(req.params.id, {
      include: ["DimKategori"],
    });
    if (pelanggan) {
      res.status(200).json(pelanggan);
    } else {
      res.status(404).json({ message: "PelangganModel not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateDimPelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaPelanggan, kategoriId, statusPelanggan, pelangganId } =
      req.body;

    // Validate required fields
    if (!kategoriId || !statusPelanggan) {
      return res.status(400).json({
        message: "kategoriId and statusPelanggan are required",
      });
    }

    // Find the pelanggan by ID
    const pelanggan = await PelangganModel.findByPk(id);

    // Check if pelanggan exists
    if (!pelanggan) {
      return res.status(404).json({ message: "Pelanggan not found" });
    }

    // Update pelanggan fields
    pelanggan.namaPelanggan = namaPelanggan;
    pelanggan.kategoriId = kategoriId;
    pelanggan.statusPelanggan = statusPelanggan;
    pelanggan.pelangganId = pelangganId;

    // Save the updated pelanggan
    await pelanggan.save();

    res.status(200).json(pelanggan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteDimPelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    const pelanggan = await PelangganModel.findByPk(id);

    if (!pelanggan) {
      return res.status(404).json({ message: "PelangganModel not found" });
    }

    await pelanggan.destroy();

    res.status(200).json({ message: "PelangganModel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
