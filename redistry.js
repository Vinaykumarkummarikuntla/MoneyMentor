const redis = require('redis');
const connectionString = 'moneymentor-redis.redis.cache.windows.net:6380,password=DmeVZBd6qH9uvNcP4k8ijjjhRikobhrA2AzCaMB8JnA=,ssl=True,abortConnect=False';


const client = redis.createClient(connectionString);

client.on('connect', () => {
    console.log('Connected to Azure Redis Cache');
});

client.connect();

(async () => {
    try {
      // Set a value
      await client.set('mykey', 'Finally redis worked');
      await client.set('mykey1', 'Azure Finally redis worked');
      await client.set('mykey2', 'Azure not getting keys');

  
      // Get the value
      const value = await client.get('mykey2');
      console.log('Value:', value);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Disconnect from Redis
     client.quit();
    }
  })();