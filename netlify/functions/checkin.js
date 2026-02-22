import { connectToDatabase } from "./utils/db.js";

export async function handler() { // Removed unused event/context
  try {
    // We call the function without assigning it to a variable 'db' 
    // just to verify the connection works.
    await connectToDatabase(); 
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello Gym! DB Connected ✅" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "DB Connection Failed ❌", error: error.message }),
    };
  }
}