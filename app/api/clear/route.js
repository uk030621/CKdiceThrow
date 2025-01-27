import clientPromise from "@/lib/mongodb";

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("fibonacci_dice");
    await db.collection("rolls").deleteMany({}); // Deletes all rolls
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error clearing history:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
