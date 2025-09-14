// import path from "path";
// import { fileURLToPath } from "url";
// import { google } from "googleapis";

// // === Fix __dirname for ES modules ===
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // === Load credentials from environment variables ===
// const credentials = {
//   type: process.env.GCP_TYPE,
//   project_id: process.env.GCP_PROJECT_ID,
//   private_key_id: process.env.GCP_PRIVATE_KEY_ID,
//   private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   client_email: process.env.GCP_CLIENT_EMAIL,
//   client_id: process.env.GCP_CLIENT_ID,
//   auth_uri: process.env.GCP_AUTH_URI,
//   token_uri: process.env.GCP_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
//   client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
//   universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
// };

// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: SCOPES,
// });

// const SHEET_ID = "1ZUTCPSQIZVM5fbdYQ3mUBnteQfN9N7rUAw8z1UX0T_g";
// const RANGE = "Sheet1!B2:B9"; // Only fetch open role numbers

// const JOB_TITLES = [
//   "Product Management",
//   "Program & Project Management",
//   "Operations & Supply Chain Management",
//   "Sales & Account Management",
//   "Category & Vendor Management",
//   "Analytics",
//   "Strategy & Consulting",
//   "Marketing Management",
// ];

// // === Fetch Roles Function ===
// export async function fetchOpenRoles() {
//   const client = await auth.getClient();
//   const sheets = google.sheets({ version: "v4", auth: client });

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: SHEET_ID,
//     range: RANGE,
//   });

//   const rows = response.data.values || [];

//   return JOB_TITLES.map((title, index) => ({
//     title,
//     count: Number(rows[index]?.[0] || 0),
//   }));
// }
