const redis = require('redis');

// Redis connection string
const connectionString = 'moneymentor-redis.redis.cache.windows.net:6380,password=DmeVZBd6qH9uvNcP4k8ijjjhRikobhrA2AzCaMB8JnA=,ssl=True,abortConnect=False';

// Create a Redis client
const client = redis.createClient(connectionString);

// Test the connection
client.on('connect', () => {
  console.log('Connected to Azure Redis Cache');

  // Set and get a test key-value pair
  client.set('testKey', 'testValue', (error, result) => {
    if (error) {
      console.error('Error setting value:', error);
    } else {
      console.log('Value set successfully');
      client.get('testKey', (error, value) => {
        if (error) {
          console.error('Error getting value:', error);
        } else {
          console.log('Retrieved value:', value);
        }
        // Close the Redis client connection
        client.quit();
      });
    }
  });
});

// Handle connection errors
client.on('error', (error) => {
  console.error('Redis connection error:', error);
});
