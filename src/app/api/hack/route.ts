export async function GET() {
  return Response.json({ 
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || "NOT_FOUND" 
  });
}
