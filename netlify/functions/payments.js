import { connectToDatabase } from "./utils/db.js";
import { ObjectId } from "mongodb";

export async function handler(event) {
  const db = await connectToDatabase();
  const collection = db.collection("payments");
  const id = event.queryStringParameters?.id;

  try {
    // GET: Fetch all logs
    if (event.httpMethod === "GET") {
      const payments = await collection.find({}).sort({ date: -1 }).toArray();
      return { statusCode: 200, body: JSON.stringify(payments) };
    }

    // DELETE: Remove a log
    if (event.httpMethod === "DELETE") {
      if (!id) return { statusCode: 400, body: "ID Required" };
      await collection.deleteOne({ _id: new ObjectId(id) });
      return { statusCode: 200, body: "Record Deleted" };
    }

    // PUT: Update an existing payment log
    if (event.httpMethod === "PUT") {
      if (!id) return { statusCode: 400, body: "ID Required" };
      const data = JSON.parse(event.body || "{}");

      await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            amount: parseInt(data.amount),
            date: data.date,
            memberName: data.memberName, // in case of a typo
          },
        },
      );
      return { statusCode: 200, body: "Record Updated" };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
