import { connectToDatabase } from "./utils/db.js";
import { ObjectId } from "mongodb";

export async function handler(event) {
  const db = await connectToDatabase();
  const membersColl = db.collection("members");
  const attendanceColl = db.collection("attendance");
  const paymentsColl = db.collection("payments");
  const id = event.queryStringParameters?.id;
  const action = event.queryStringParameters?.action;

  try {
    // --- LOG ATTENDANCE (POST ?action=checkin) ---
    if (event.httpMethod === "POST" && action === "checkin") {
      const data = JSON.parse(event.body || "{}");
      const log = {
        memberId: new ObjectId(data.memberId),
        name: data.name,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };
      await attendanceColl.insertOne(log);
      await membersColl.updateOne(
        { _id: new ObjectId(data.memberId) },
        { $set: { lastCheckIn: log.timestamp } }
      );
      return { statusCode: 200, body: JSON.stringify({ message: "Attendance Logged" }) };
    }

    // --- RENEW & LOG PAYMENT (PATCH) ---
    if (event.httpMethod === "PATCH") {
      if (!id) return { statusCode: 400, body: "Missing Member ID" };
      const data = JSON.parse(event.body || "{}");
      const amountPaid = data.amount || 700; 
      const member = await membersColl.findOne({ _id: new ObjectId(id) });
      
      let currentEnd = new Date(member.membershipEnd);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let newEnd = currentEnd > today ? currentEnd : today;
      newEnd.setDate(newEnd.getDate() + 30);
      const finalExpiry = newEnd.toISOString().split('T')[0];

      await membersColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: { membershipEnd: finalExpiry, lastPaymentDate: new Date().toISOString() } }
      );

      await paymentsColl.insertOne({
        memberId: new ObjectId(id),
        memberName: member.name,
        amount: amountPaid,
        date: new Date().toISOString(),
        currency: "PKR"
      });

      return { statusCode: 200, body: JSON.stringify({ newExpiry: finalExpiry }) };
    }

    // --- GET ALL MEMBERS (GET) ---
    if (event.httpMethod === "GET") {
      const members = await membersColl.find({}).toArray();
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(members) };
    }

    // --- CREATE MEMBER (POST) ---
    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body || "{}");
      const newMember = {
        name: data.name,
        phone: data.phone,
        address: data.address || "",
        membershipEnd: data.membershipEnd,
        joinedDate: new Date().toISOString().split('T')[0],
        lastCheckIn: null,
        isActive: true
      };
      const result = await membersColl.insertOne(newMember);
      return { statusCode: 201, body: JSON.stringify(result) };
    }

    // --- UPDATE DETAILS (PUT) ---
    if (event.httpMethod === "PUT") {
      const data = JSON.parse(event.body || "{}");
      await membersColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: { 
            name: data.name, 
            phone: data.phone, 
            address: data.address, 
            membershipEnd: data.membershipEnd 
          } 
        }
      );
      return { statusCode: 200, body: "Update Successful" };
    }

    // --- DELETE ---
    if (event.httpMethod === "DELETE") {
      await membersColl.deleteOne({ _id: new ObjectId(id) });
      return { statusCode: 200, body: "Deleted" };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
}