import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, keyword, gcpKey, folderId } = body;

    if (!gcpKey) {
      return NextResponse.json({ error: "Missing Google Cloud JSON Key." }, { status: 400 });
    }

    if (!folderId) {
      return NextResponse.json({ error: "Missing Folder ID. Please add it in Settings." }, { status: 400 });
    }

    let credentials;
    try {
      credentials = JSON.parse(gcpKey);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON format for GCP Key." }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents"
      ],
    });

    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

    const title = `Best ${keyword} Strategies and Resources`;

    // 1. Create a new document inside the user's shared folder via Drive API (bypasses service account quota limits)
    const driveFile = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId]
      },
      fields: "id"
    });

    const documentId = driveFile.data.id;
    if (!documentId) throw new Error("Failed to create document in Drive.");

    // 2. Insert text and link into the document using Docs API
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
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error("Google API Error:", errorDetail);
    return NextResponse.json(
      { error: errorDetail || "Failed to process Google Stacking." },
      { status: 500 }
    );
  }
}
