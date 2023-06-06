const redis = require('redis');

const connectionString = 'moneymentor-redis.redis.cache.windows.net:6380,password=DmeVZBd6qH9uvNcP4k8ijjjhRikobhrA2AzCaMB8JnA=,ssl=True,abortConnect=False';

const redisClient = redis.createClient(connectionString);

// Test the connection
redisClient.on('connect', () => {
  console.log('Connected to Azure Redis Cache');
});

// Handle connection errors
redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Use the Redis client for your desired operations
// redisClient.set(key, value);
// redisClient.get(key);
// ...

module.exports = redisClient;