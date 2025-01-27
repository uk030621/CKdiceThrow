import { generateFibonacci } from "@/utils/fibonacci";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { limit } = await req.json();
  const fibSequence = generateFibonacci(limit || 10);
  const randomIndex = Math.floor(Math.random() * fibSequence.length);
  const randomFib = fibSequence[randomIndex];

  // Save the roll in the database
  try {
    const client = await clientPromise;
    const db = client.db("fibonacci_dice");
    await db
      .collection("rolls")
      .insertOne({ roll: randomFib, createdAt: new Date() });
  } catch (error) {
    console.error("Error saving to database:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ roll: randomFib }), {
    headers: { "Content-Type": "application/json" },
  });
}
