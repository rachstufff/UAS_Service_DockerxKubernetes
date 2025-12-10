const express = require("express");
const router = express.Router();
const BarangController = require("../controllers/barangController");

// CRUD routes for barang
router.get("/barang", BarangController.getAll);
router.get("/barang/:id", BarangController.getById);
router.post("/barang", BarangController.create);
router.put("/barang/:id", BarangController.update);
router.delete("/barang/:id", BarangController.delete);

module.exports = router;
