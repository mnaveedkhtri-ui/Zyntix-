const { google } = require('googleapis');

const credentials = {
  "type": "service_account",
  "project_id": "zyntix-seo",
  "private_key_id": "bfdd7dac42ba40aa4e840bbbfd257fbc9fb0cf86",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMRBQX6OI3Oj9P\nqJfrji9ke9f2NHJhkwVss0EInOu1ItJzuTpvN48dywur8GVGjRWIyFI7wq+reM9A\nWhFBdUk+K0SdwtgAw5FRjwaWrfv+TFJTgt7k1QiVmC4MXHTuzEee6MGpQQxJ5Xte\n8OhnpozkHB/1x6kpiSkPGmiqtv4tYU+D0Ri66PTe/hI7avuMtsNucedZCrjy8e6Z\nnMU4TetoniWLWUyxAMqkc1NCsvjoIAaBPLUIRqwmDidyQkVafnTGq9FZkCWubij8\n6ipqUfT7GX8nAl3LESlOG9amQLRLQr3Y+yiqDpAkwiykUpYGmaI3J4DIoQ3rzhqD\nct5/jUhDAgMBAAECggEASOznNZANr0Tq1IAu2MiW7+ts8zfPPDm2fpPSnIYVesI3\nW1xeWdV+kVbr0FNPfOwiq4ZFIZPEjtXfPCzLq1B5uSnOYfptjnxDtdf3tLTh2eya\nmbkH5a+O1IWTrxMVJiolSbz0Yv5Xqkw1CvS8LEEgXNITsPY61RrkX0GA663QOhe3\n71QnZ+q5FV+E5oq+aEEHCIa4AUixGHQtUmI87i8IhQYmaruz9JjUxGHpZFdU8HcZ\nO6hJEkX+/0WHzBGJuq0VAF9iauG+20DkNknorwQymXOvtKmGLjOgqJBsPwBe0OOo\n62N862GTMw6ZvqWFUCcA4yNfR2YyK3i7sa9IJlEZYQKBgQDpqSb1s024Y7hElb41\nSBg4CKh9hakZWA7aGBZy21iTQi+WvJmsCBWo7ns92SkNZNxNndM4U41ZoQXBhS9S\nvYtkkQaLkhaxQpwK3o9tB6WMAHIvoYnqa37ZR/O6xuDe75YR+nUGX1Wd3F1H6mnw\n6mtMoUlurvucugtPdgKvRIJF4wKBgQDfy3zste2JeYVbynl6AF+YiZ3tOy3/gRhm\nUxr71wEC1DSx+W9Tt5DYYS7D9Omdhm0ZppbFVXv6DO9UrnKVK/RwotYAi4I18M9f\nKxglR53pWisXhRArpRhL2nH0PQaFcfe98wM73mMHVoQfSXpmhKw8Ys6Oid3Lds1E\nh5UGmreCIQKBgCiVh73PSeWH9H59H89zWTmKT3GV4JwVTmcVHfkPHiBds5RT58EY\nmmKAIYnJiTbZWOZmTkSPRpLVxAEr199gKrDp+6AMXMKnFiFRLMo8NMXPYgXh4emE\niEDHHY9IcdBm/sLapK7Zqi5EEzOlhIciwEZMEUwXOn6rVcGUdrzoglQPAoGBAInI\ngaBHHfje3XE3BnVLl4+VYqr1HYvKUlhlYB6fL9srBUpx1M3JHZ9qrd0tg0tdwPvi\n6b6Ss+KuZgdP4/HdfwB98J2jRsao/TONl68UGa/auN8hKGSGn5/L3Q7PJ52vHiVP\nYbVRZMzWwj91AKvvkQ8Yki2Fyg0DlrtTcjf/t22hAoGBAIbS65NdR8QiIbN1yFRo\nLHs5fHbtrgnkGL+w1LLN83Eg/4SXOySoiaN3OBJpsNQ3cq9qG85Rw6hLNprnWO4o\nS4qNwFjyrwpL4pCtejjp0h9MvQ0A48R8z3Xm6gx7TANjvmPojo9TCFR0rPqIuMRQ\neJ7q2dGWAdS2aAvBxQBWa59+\n-----END PRIVATE KEY-----\n",
  "client_email": "zyntix-bot@zyntix-seo.iam.gserviceaccount.com"
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents"
  ],
});

const drive = google.drive({ version: "v3", auth });
const docs = google.docs({ version: "v1", auth });

async function testCreate() {
  try {
    console.log("Creating doc via Drive API...");
    const driveFile = await drive.files.create({
      requestBody: {
        name: "Test Zyntix via Drive",
        mimeType: "application/vnd.google-apps.document"
      }
    });
    console.log("Doc created:", driveFile.data.id);
    
    console.log("Editing via Docs API...");
    await docs.documents.batchUpdate({
      documentId: driveFile.data.id,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: "Hello World!\n",
            },
          }
        ],
      },
    });
    console.log("Docs Edited successfully!");
    
  } catch (error) {
    console.error("API Error details:", JSON.stringify(error.response?.data, null, 2) || error.message);
  }
}

testCreate();
