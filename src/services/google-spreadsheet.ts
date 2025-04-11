import { google } from "googleapis";

export async function getGoogleSheetsData() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: "service_account",
            private_key: process.env.GOOGLE_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            token_url: "https://oauth2.googleapis.com/token",
            universe_domain: "googleapis.com",
          },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
}