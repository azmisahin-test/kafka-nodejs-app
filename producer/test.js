// producer\test.js
require("dotenv").config();
const { runProducer } = require('./kafkaProducer');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const clientId = 'producer-test';
const topic = 'topic-common';

setTimeout(() => {
    runProducer(KAFKA_BROKERS, clientId, topic).catch(console.error);
}, 1000);
