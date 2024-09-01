import KategoriModel from "../models/KategoriModel.js";

export const createDimKategori = async (req, res) => {
    try {
        const { namaKategori, statusKategori } = req.body;
        const kategori = await KategoriModel.create({
            namaKategori,
            statusKategori
        });
        res.status(201).json(kategori);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDimKategori = async (req, res) => {
    try {
        const kategori = await KategoriModel.findAll();
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
        const { namaKategori, statusKategori } = req.body;
        const kategori = await KategoriModel.findByPk(req.params.id);
        if (kategori) {
            kategori.namaKategori = namaKategori;
            kategori.statusKategori = statusKategori;
            await kategori.save();
            res.status(200).json(kategori);
        } else {
            res.status(404).json({ message: "KategoriModel not found" });
        }
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
