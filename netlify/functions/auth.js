import { connectToDatabase } from "./utils/db.js";

export async function handler(event) { 
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    const db = await connectToDatabase();
    
    const admin = await db.collection("admins").findOne({ username });

    if (admin && admin.password === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Login Successful", user: admin.username }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid Credentials" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: error.message }),
    };
  }
}