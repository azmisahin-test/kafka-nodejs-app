// consumer\kafkaConsumer.js
const { Kafka } = require('kafkajs');
const winston = require('winston');
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
        new winston.transports.File({ filename: 'logs/consumer.log' }),
    ],
});

async function createTopicIfNotExists(admin, topic) {
    try {
        const topics = await admin.listTopics();
        if (!topics.includes(topic)) {
            await admin.createTopics({
                topics: [{ topic }],
            });
            logger.info(`Topic ${topic} created`);
        } else {
            logger.info(`Topic ${topic} already exists`);
        }
    } catch (error) {
        logger.error(`Error creating topic ${topic}: ${error.message}`);
    }
}

async function connectAndConsume(KAFKA_BROKERS, clientId, groupId, topic) {
    const config = {
        clientId: clientId,
        brokers: [KAFKA_BROKERS],
        logLevel: 1,
        retry: { initialRetryTime: 1000, retries: 10 },
        requestTimeout: 60000,
        metadataMaxAge: 60000,
    };

    const kafka = new Kafka(config);

    try {
        const admin = kafka.admin();
        await admin.connect();
        await createTopicIfNotExists(admin, topic);
        await admin.disconnect();

        const consumer = kafka.consumer({ groupId: groupId, sessionTimeout: 30000 });
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });

        logger.info(`Consumer connected to topic ${topic} and ready to consume messages.`);

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const receivedMessage = JSON.parse(message.value.toString());
                    logger.info(`T: ${receivedMessage.timestamp} | R_ID: ${receivedMessage.id} | C_ID: ${receivedMessage.clientId}`);

                    // Process message further here...

                } catch (error) {
                    logger.error(`Error processing message from topic ${topic}: ${error.message}`);
                }
            },
        });
    } catch (error) {
        logger.error(`Error connecting to Kafka: ${error.message}`);
    }
}

module.exports = { connectAndConsume };
