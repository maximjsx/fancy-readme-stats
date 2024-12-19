import { MongoClient } from "mongodb";

let client = null;
let failedConnections = 0;
const MAX_RETRIES = 5;
const CONNECTION_TIMEOUT = 5000;

export async function connectToDatabase() {
  if (client) return client;

  if (!process.env.MONGODB_URI) {
    return;
  }

  if (failedConnections >= MAX_RETRIES) {
    throw new Error("Maximum database connection retries exceeded");
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      ssl: true,
      tls: true,
      tlsInsecure: false,
      minPoolSize: 1,
      maxPoolSize: 10
    });
    await client.connect();
    failedConnections = 0;
    return client;
  } catch (err) {
    failedConnections++;
    client = null;
    
    if (err.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
      console.error('SSL/TLS Connection Error:', {
        message: 'Failed to establish secure connection to MongoDB',
        suggestion: 'Try using Node.js LTS version or check MongoDB Atlas network settings'
      });
      return null;
    }
    
    throw err;
  }
}

export async function trackUsername(username) {
  try {
    const client = await connectToDatabase();
    if (!client) return;
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    await db.collection("users").updateOne(
      { username: username.toLowerCase() },
      { $set: { 
        username: username.toLowerCase(),
        first_seen: new Date(),
        last_seen: new Date()
      } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Failed to track username:', error);
  }
}

export async function trackRepository(username, reponame) {
  try {
    const client = await connectToDatabase();
    if (!client) return;
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    await db.collection("repositories").updateOne(
      { 
        username: username.toLowerCase(),
        repository: reponame.toLowerCase()
      },
      { $set: {
        username: username.toLowerCase(),
        repository: reponame.toLowerCase(),
        first_seen: new Date(),
        last_seen: new Date()
      } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Failed to track repository:', error);
  }
}