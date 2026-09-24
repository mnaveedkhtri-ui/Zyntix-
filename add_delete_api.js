const fs = require("fs");
let content = fs.readFileSync("src/app/api/reports/route.ts", "utf8");

const deleteMethod = `
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return new NextResponse("Missing ID", { status: 400 });

    const client = getClient();
    await client.connect();

    // Ensure the user only deletes their own report
    await client.query("DELETE FROM reports WHERE id = $1 AND user_id = $2", [id, userId]);

    await client.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
`;

fs.writeFileSync("src/app/api/reports/route.ts", content + deleteMethod, "utf8");
console.log("Added DELETE method");
