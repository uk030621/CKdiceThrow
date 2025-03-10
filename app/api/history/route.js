import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fibonacci_dice");
    const rolls = await db
      .collection("rolls")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return new Response(JSON.stringify({ rolls }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching from database:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
