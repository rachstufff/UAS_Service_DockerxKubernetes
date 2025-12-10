const db = require("../db_config");

class Barang {
  // Get all barang
  static getAll(callback) {
    db.query("SELECT * FROM barang", callback);
  }

  // Get barang by ID
  static getById(id, callback) {
    db.query("SELECT * FROM barang WHERE id = ?", [id], callback);
  }

  // Create new barang
  static create(data, callback) {
    const { nama_barang, berat_kg, jarak_km, jenis_kendaraan } = data;
    db.query(
      "INSERT INTO barang (nama_barang, berat_kg, jarak_km, jenis_kendaraan) VALUES (?, ?, ?, ?)",
      [nama_barang, berat_kg, jarak_km, jenis_kendaraan],
      callback
    );
  }

  // Update barang
  static update(id, data, callback) {
    const { nama_barang, berat_kg, jarak_km, jenis_kendaraan } = data;
    db.query(
      "UPDATE barang SET nama_barang=?, berat_kg=?, jarak_km=?, jenis_kendaraan=? WHERE id=?",
      [nama_barang, berat_kg, jarak_km, jenis_kendaraan, id],
      callback
    );
  }

  // Delete barang
  static delete(id, callback) {
    db.query("DELETE FROM barang WHERE id=?", [id], callback);
  }
}

module.exports = Barang;
