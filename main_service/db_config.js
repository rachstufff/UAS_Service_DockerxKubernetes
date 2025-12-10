const mysql = require("mysql2");

// Konfigurasi dari .env - Gunakan connection pool untuk reliability
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "mysql-db",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "rootpassword",
  database: process.env.MYSQL_DATABASE || "db_logistik",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk koneksi dengan retry logic
function connectWithRetry(retries = 5, delay = 5000) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Gagal koneksi ke MySQL:", err.message);
      if (retries > 0) {
        console.log(
          `Retry koneksi MySQL dalam ${
            delay / 1000
          } detik... (${retries} attempts left)`
        );
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      } else {
        console.error("❌ Gagal koneksi ke MySQL setelah beberapa percobaan.");
      }
      return;
    }

    console.log("✅ Terhubung ke MySQL Database (Docker)!");

    // Buat tabel jika belum ada
    const sqlBarang = `CREATE TABLE IF NOT EXISTS barang (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama_barang VARCHAR(255),
            berat_kg FLOAT,
            jarak_km FLOAT,
            jenis_kendaraan VARCHAR(50)
        )`;
    connection.query(sqlBarang);

    const sqlUsers = `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(255) NULL, 
            provider VARCHAR(20) DEFAULT 'manual'
        )`;
    connection.query(sqlUsers, (err) => {
      if (!err) console.log("Tabel 'users' & 'barang' siap.");
    });

    connection.release();
  });
}

// Mulai koneksi dengan retry
connectWithRetry();

module.exports = pool;
