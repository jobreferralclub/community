// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/communityDB";

// export default async function connectDB() {
//   const client = new MongoClient(uri);
//   await client.connect();
//   const db = client.db('communityDB');
//   console.log("Connected to MongoDB");
//   return db;
// }

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/communityDB';

let client;
let db;

export default async function connectDB() {
  if (db) return db; // reuse existing connection
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('communityDB');
  console.log('Connected to MongoDB');
  return db;
}

