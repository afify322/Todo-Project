const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://first:6PhsjC3EuCp4z9oy@cluster0.kb4eg.mongodb.net/clinc?authSource=admin&replicaSet=atlas-spouhm-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';
//const url='mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name

module.exports={async main() {
  // Use connect method to connect to the server
  try {
    
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('todos');
  
    return db;
  } catch (error) {
    process.exit(1);
  }
},
async collection(name){
  return  (await this.main()).collection(name)
}
}

