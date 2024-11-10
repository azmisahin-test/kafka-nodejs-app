// consumer\test.js
require("dotenv").config();
const { connectAndConsume } = require('./kafkaConsumer');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const clientId = 'consumer-test';
const groupId = 'group-test';
const topic = 'topic-common';

setTimeout(() => {
    connectAndConsume(KAFKA_BROKERS, clientId, groupId, topic).catch(console.error);
}, 1000);
