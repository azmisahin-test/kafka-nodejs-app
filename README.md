# kafka-nodejs-app
Message exchange on Nodejs with Kafka Native inside and outside of Docker

consumer/.env
```
# .env
# Production Environment

# Kafka Environment Convert
KAFKA_BROKERS=localhost:9092
```

producer/.env
```
# .env
# Production Environment

# Kafka Environment Convert
KAFKA_BROKERS=localhost:9092
```

/.env
```
# .env
# Production Environment

# Message Brokers
# Kafka
KAFKA_NODE_ID=1
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP='CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
KAFKA_ADVERTISED_LISTENERS='PLAINTEXT_HOST://localhost:9092,PLAINTEXT://kafka:19092' # Internal docker communication
KAFKA_LISTENERS='CONTROLLER://:29093,PLAINTEXT_HOST://:9092,PLAINTEXT://:19092' # Internal docker communication
KAFKA_PROCESS_ROLES='broker,controller'
KAFKA_CONTROLLER_QUORUM_VOTERS='1@kafka:29093'
KAFKA_INTER_BROKER_LISTENER_NAME='PLAINTEXT'
KAFKA_CONTROLLER_LISTENER_NAMES='CONTROLLER'
CLUSTER_ID='cluster-4hrfc'
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=1000 # Initial rebalance delay
KAFKA_SESSION_TIMEOUT_MS=60000 # Increase consumer connection time to 60 seconds
KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1
KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1
KAFKA_LOG_RETENTION_HOURS=168 # Keep messages for 7 days (168 hours)
KAFKA_LOG_RETENTION_BYTES=1073741824 # Delete messages if they exceed 1GB
KAFKA_LOG_DIRS='/tmp/kraft-combined-logs'

# Kafka Environment Convert
KAFKA_BROKERS=localhost:9092
```
