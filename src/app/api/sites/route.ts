import { NextResponse } from "next/server";
import { getAllSites, saveOrUpdateSite, getSiteById } from "@/lib/sites";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      const site = getSiteById(id);
      return NextResponse.json({ success: true, site });
    }
    const sites = getAllSites();
    return NextResponse.json({ success: true, sites });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.subdomain || !body.name) {
      return NextResponse.json(
        { success: false, error: "Subdomain and Site Name are required" },
        { status: 400 }
      );
    }
    const saved = saveOrUpdateSite(body);
    return NextResponse.json({ success: true, site: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
