const { google } = require('googleapis');
const path = require('path');
const { SHEET_ID, SHEET_RANGE } = require('./config.cjs');

// Get absolute path to credentials.json
const keyPath = path.join(__dirname, 'credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function fetchData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE,
  });

  // Convert rows into objects keyed off header row
  const [headers, ...rows] = result.data.values;
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header] = row[i] || "");
    return obj;
  });
}

async function generatePostsAll() {
  const data = await fetchData();
  console.log('Fetched rows:', data.length); // ADD THIS LINE
   // Optionally log the first row:
  if (data.length > 0) {
      console.log('First row:', data[0]);
  }
  data.forEach(row => {
    if (row['Job ID']) {
      const message = `Job Referral Opportunity
Job ID: ${row['Job ID']}
Company Name: ${row['Company Name']}
Job Role: ${row['Job Title']}
Location: ${row['Location']}
${row["Hiring Manager's Name"]} is hiring for ${row['Job Title']} at ${row['Company Name']}.
Refer Job Description for more details. If you find this role relevant and are interested to be referred, please send your CV to support@jobreferral.club mentioning Job ID: ${row['Job ID']} at subject line. We will refer on your behalf.
T&C applied.
`;
      console.log(message);
    }
  });
}

generatePostsAll();
