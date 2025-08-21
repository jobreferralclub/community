const axios = require('axios');
const { google } = require('googleapis');
const path = require('path');
const { SHEET_ID, SHEET_RANGE } = require('./config.cjs');

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

  const [headers, ...rows] = result.data.values;
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header.trim()] = row[i] || "");
    return obj;
  });
}

// Function to create a single post by calling your backend API
async function createPost(title, content) {
  try {
    const response = await axios.post('http://localhost:5000/api/posts/', {
      title: title,
      content: content,
      userId: '68983120b0b01c3a69f54851',  // Replace with valid userId or pass dynamically
      // Add other required post fields here, for example userId if needed
    });
    console.log(`Post created: ${response.data._id}`);
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
  }
}

async function generatePostsAll() {
  const data = await fetchData();
  console.log('Fetched rows:', data.length);
  if (data.length > 0) {
    console.log('First row:', data[0]);
  }

  for (const row of data) {
    // Assuming your sheet header key for Job ID is 'Job ID', trim spaces just in case
    const jobId = row['Job ID'] || row['Job ID ']; // fallback if extra spaces in header
    if (jobId && jobId.trim()) {
      const trimmedJobId = jobId.trim();
      const message = `Job Referral Opportunity
Job ID: ${trimmedJobId}
Company Name: ${row['Company Name']}
Job Role: ${row['Job Title']}
Location: ${row['Location']}
${row["Hiring Manager's Name"]} is hiring for ${row['Job Title']} at ${row['Company Name']}.
Refer Job Description for more details. If you find this role relevant and are interested to be referred, please send your CV to support@jobreferral.club mentioning Job ID: ${trimmedJobId} at subject line. We will refer on your behalf.
T&C applied.
`;
      console.log(`Creating post for Job ID: ${trimmedJobId}`);
      await createPost(trimmedJobId, message);
    }
  }
}

generatePostsAll();
