const redis=require('redis');
exports.client=async () => {
    const client = redis.createClient();
  
   /*  createClient({
        url: 'redis://alice:foobared@awesome.redis.server:6380'
      }); */
      
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    return client;
  };