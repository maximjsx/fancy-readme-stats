import { MongoClient } from "mongodb";

let client = null;

export async function connectToDatabase() {
  if (client) return client;

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client;
}

export async function trackUsername(username) {
  const client = await connectToDatabase();
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
}

export async function trackRepository(username, reponame) {
  const client = await connectToDatabase();
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
} 