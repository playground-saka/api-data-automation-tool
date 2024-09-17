import KategoriModel from "../models/KategoriModel.js";

export const createDimKategori = async (req, res) => {
  try {
    const { namaKategori, statusKategori } = req.body;
    const kategori = await KategoriModel.create({
      namaKategori,
      statusKategori,
    });
    res.status(201).json(kategori);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDimKategori = async (req, res) => {
  try {
    const is_status = parseInt(req.query.is_status, 10);

    const whereClause = {};
    if (is_status && is_status === 1) {
      whereClause.statusKategori = true;
    }

    const kategori = await KategoriModel.findAll({
      where: whereClause,
    });

    res.status(200).json(kategori);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDimKategoriById = async (req, res) => {
  try {
    const kategori = await KategoriModel.findByPk(req.params.id);
    if (kategori) {
      res.status(200).json(kategori);
    } else {
      res.status(404).json({ message: "KategoriModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDimKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaKategori, statusKategori } = req.body;
    const kategori = await KategoriModel.findByPk(id);

    if (!kategori) {
      return res.status(404).json({ message: "Kategori not found" });
    }

    if (namaKategori !== undefined) kategori.namaKategori = namaKategori;
    if (statusKategori !== undefined) kategori.statusKategori = statusKategori;

    await kategori.save();

    res.status(200).json(kategori);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDimKategori = async (req, res) => {
  try {
    const kategori = await KategoriModel.findByPk(req.params.id);
    if (kategori) {
      await kategori.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ message: "KategoriModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
