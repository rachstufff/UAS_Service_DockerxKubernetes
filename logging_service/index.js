const amqp = require("amqplib");
const fs = require("fs");
const path = require("path");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq-server";
const QUEUE_NAME = "system_logs";

// Persiapan Folder Log
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logFile = path.join(logDirectory, "activity.log");

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Pastikan Queue tersedia
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[*] Logging Service Menunggu pesan di queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const logData = msg.content.toString();
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${logData}\n`;

        // 1. Tulis ke Console Docker
        console.log(`[Log Saved] ${logData}`);

        // 2. Simpan ke File (Persistent)
        fs.appendFile(logFile, logEntry, (err) => {
          if (err) console.error("Gagal menulis file log:", err);
        });

        channel.ack(msg); // Konfirmasi pesan sudah diproses
      }
    });
  } catch (error) {
    console.error("Gagal koneksi ke RabbitMQ, retry dalam 5 detik...", error);
    setTimeout(startConsumer, 5000);
  }
}

startConsumer();
