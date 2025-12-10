const amqp = require('amqplib');

let channel = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq-server';
const QUEUE_NAME = 'system_logs';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ Terhubung ke RabbitMQ sebagai Producer");
        
        // Handle jika koneksi putus tiba-tiba
        connection.on("error", (err) => {
            console.error("RabbitMQ Connection Error:", err);
            setTimeout(connectRabbitMQ, 5000); // Retry
        });
        connection.on("close", () => {
            console.warn("RabbitMQ Connection Closed. Retrying...");
            setTimeout(connectRabbitMQ, 5000); // Retry
        });

    } catch (error) {
        console.error("❌ Gagal koneksi RabbitMQ (Producer). Retry dalam 5s...", error.message);
        setTimeout(connectRabbitMQ, 5000); // Retry connection
    }
}

connectRabbitMQ();

function sendLog(serviceName, event, details = "") {
    if (!channel) {
        // Jangan crash app, cukup warn saja
        console.warn(`[Log Skipped] RabbitMQ belum siap. Event: ${event}`);
        return;
    }
    
    const message = JSON.stringify({
        service: serviceName,
        event: event,
        details: details,
        timestamp: new Date().toISOString() // Tambahkan timestamp di data JSON juga
    });

    try {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
    } catch (err) {
        console.error("Gagal mengirim log ke queue:", err);
    }
}

module.exports = { sendLog };