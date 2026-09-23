import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, keyword, gcpKey } = body;

    if (!gcpKey) {
      return NextResponse.json({ error: "Missing Google Cloud JSON Key." }, { status: 400 });
    }

    let credentials;
    try {
      credentials = JSON.parse(gcpKey);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON format for GCP Key." }, { status: 400 });
    }

    // Authenticate with Google Drive & Docs APIs
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents"
      ],
    });

    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

    // 1. Create a new blank document
    const title = `Best ${keyword} Strategies and Resources`;
    const doc = await docs.documents.create({
      requestBody: {
        title: title,
      },
    });

    const documentId = doc.data.documentId;
    if (!documentId) throw new Error("Failed to create document.");

    // 2. Insert text and link into the document
    const textToInsert = `Welcome to the official SEO guide for ${keyword}.\nIf you are looking for top-tier services, we highly recommend visiting our main resource page below.\n\nClick here for more info: `;
    
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: textToInsert + targetUrl + "\n",
            },
          },
          {
            updateTextStyle: {
              range: {
                startIndex: textToInsert.length + 1,
                endIndex: textToInsert.length + 1 + targetUrl.length,
              },
              textStyle: {
                link: { url: targetUrl },
                foregroundColor: { color: { rgbColor: { blue: 1.0 } } },
                underline: true
              },
              fields: "link,foregroundColor,underline"
            }
          }
        ],
      },
    });

    // 3. Make the document public (Anyone with the link can view)
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const publicUrl = `https://docs.google.com/document/d/${documentId}/view`;

    const links = [{
      id: documentId,
      url: publicUrl,
      platform: "Google Docs (DA 99)",
      status: "Live",
      da: "99"
    }];

    return NextResponse.json({
      success: true,
      message: "Google Entity Stack generated successfully",
      data: links
    });

  } catch (error: any) {
    console.error("Google API Error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to process Google Stacking." },
      { status: 500 }
    );
  }
}
