// db.js
import { MongoClient } from "mongodb";

let client;
let db;
//eslint-disable-next-line no-undef
const uri = process.env.MONGO_URI;

export async function connectToDatabase() {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("gym");
  return db;
}