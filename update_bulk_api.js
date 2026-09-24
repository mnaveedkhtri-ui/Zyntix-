const fs = require("fs");
let content = fs.readFileSync("src/app/api/reports/route.ts", "utf8");

// We need to modify the DELETE function to support 'ids' as a comma-separated string
const newDeleteMethod = `
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const ids = url.searchParams.get("ids");
    
    if (!id && !ids) return new NextResponse("Missing ID(s)", { status: 400 });

    const client = getClient();
    await client.connect();

    if (ids) {
      const idArray = ids.split(",");
      await client.query("DELETE FROM reports WHERE id = ANY($1::uuid[]) AND user_id = $2", [idArray, userId]);
    } else {
      await client.query("DELETE FROM reports WHERE id = $1 AND user_id = $2", [id, userId]);
    }

    await client.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete report(s):", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
`;

// Replace the existing DELETE function
content = content.replace(/export async function DELETE[\s\S]*?^}/m, newDeleteMethod.trim());
fs.writeFileSync("src/app/api/reports/route.ts", content, "utf8");
console.log("Updated DELETE API for bulk");
