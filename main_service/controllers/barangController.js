const Barang = require("../models/Barang");
const { sendLog } = require("../utils/logger");

class BarangController {
  // Get all barang
  static getAll(req, res) {
    Barang.getAll((err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  }

  // Get barang by ID
  static getById(req, res) {
    Barang.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) {
        return res.status(404).json({ message: "Barang tidak ditemukan" });
      }
      res.json(results[0]);
    });
  }

  // Create new barang
  static create(req, res) {
    const { nama_barang, berat_kg, jarak_km, jenis_kendaraan } = req.body;

    Barang.create(
      { nama_barang, berat_kg, jarak_km, jenis_kendaraan },
      (err, result) => {
        if (err) return res.status(500).json(err);

        sendLog(
          "MAIN_SERVICE",
          "CREATE_ITEM",
          `Barang ditambahkan: ${nama_barang}`
        );

        res.status(201).json({
          message: "Barang berhasil ditambahkan",
          id: result.insertId,
        });
      }
    );
  }

  // Update barang
  static update(req, res) {
    const { nama_barang, berat_kg, jarak_km, jenis_kendaraan } = req.body;

    // Validate required fields
    if (!nama_barang || !berat_kg || !jarak_km) {
      return res.status(400).json({
        error: "Missing required fields: nama_barang, berat_kg, jarak_km",
      });
    }

    Barang.update(
      req.params.id,
      { nama_barang, berat_kg, jarak_km, jenis_kendaraan },
      (err) => {
        if (err) return res.status(500).json(err);

        sendLog(
          "MAIN_SERVICE",
          "UPDATE_ITEM",
          `Barang ID ${req.params.id} diupdate: ${nama_barang}`
        );

        res.json({ message: "Barang berhasil diupdate" });
      }
    );
  }

  // Delete barang
  static delete(req, res) {
    Barang.delete(req.params.id, (err) => {
      if (err) return res.status(500).json(err);

      sendLog(
        "MAIN_SERVICE",
        "DELETE_ITEM",
        `Barang ID ${req.params.id} dihapus.`
      );

      res.json({ message: "Barang berhasil dihapus" });
    });
  }
}

module.exports = BarangController;
