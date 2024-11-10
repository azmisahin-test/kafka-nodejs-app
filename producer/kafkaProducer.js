// producer\kafkaProducer.js
const { Kafka, Partitioners } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

// Logger configuration using winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/producer.log' }),
    ],
});

async function runProducer(KAFKA_BROKERS, clientId, topic) {
    const config = {
        clientId: clientId,
        brokers: [KAFKA_BROKERS],
        logLevel: 1,
        retry: { initialRetryTime: 1000, retries: 10 },
        requestTimeout: 60000,
        metadataMaxAge: 60000,
    };

    const kafka = new Kafka(config);
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

    try {
        await producer.connect();
        logger.info('Producer connected to Kafka broker.');

        // Function to send message with retry logic
        const sendMessage = async (message) => {
            try {
                await producer.send({
                    topic: topic,
                    messages: [
                        {
                            value: JSON.stringify(message),
                        },
                    ],
                });
                logger.info(`T: ${message.timestamp} | S_ID: ${message.id} | C_ID: ${message.clientId}`);
            } catch (error) {
                logger.error(`Error sending message to Kafka: ${error.message}`);
                throw error;  // Re-throw to trigger retry logic if needed
            }
        };

        // Message production loop with interval
        const produceMessage = async () => {
            const message = {
                id: uuidv4(),
                clientId: clientId,
                timestamp: new Date().toISOString(), // UTC timestamp in ISO 8601 format
            };

            try {
                await sendMessage(message);
            } catch (error) {
                logger.error(`Failed to send message: ${error.message}`);
            }
        };

        // Run producer every 5 seconds
        setInterval(produceMessage, 5000);

    } catch (error) {
        logger.error(`Error connecting producer to Kafka: ${error.message}`);
    }
}

module.exports = { runProducer };
