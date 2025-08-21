const axios = require('axios');
const { google } = require('googleapis');
const path = require('path');
const {
  OPERATIONS_INDIA_SHEET_ID,
  PROGRAM_AND_PROJECT_INDIA_SHEET_ID,
  PRODUCT_INDIA_SHEET_ID,
  MARKETING_INDIA_SHEET_ID,
  CATEGORY_AND_VENDOR_INDIA_SHEET_ID,
  SALES_AND_ACCOUNT_SHEET_ID,
  FINANCE_INDIA_SHEET_ID,
  HUMAN_RESOURCES_INDIA_SHEET_ID,
  ANALYTICS_INDIA_SHEET_ID,
  STRATEGY_INDIA_SHEET_ID,
  SHEET_RANGE,
} = require('./config.cjs');

const keyPath = path.join(__dirname, 'credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function fetchData(spreadsheetId, range) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });

  const [headers, ...rows] = result.data.values;
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => (obj[header.trim()] = row[i] || ""));
    return obj;
  });
}

// Function to create a single post by calling your backend API
async function createPost(title, content, job_description, community) {
  try {
    const response = await axios.post('http://localhost:5000/api/posts/', {
      title: title,
      content: content,
      userId: '68983120b0b01c3a69f54851', // Replace or pass dynamically if needed
      community: community,
      job_description: job_description,
      type: "job-posting",
    });
    console.log(`Post created: ${response.data._id}`);
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
  }
}

async function generatePostsAll() {
  // Array of sheets with their respective spreadsheet IDs and community names
  const sheetsToProcess = [
    {
      id: OPERATIONS_INDIA_SHEET_ID,
      community: "Operations & Supply Chain - India",
    },
    {
      id: PROGRAM_AND_PROJECT_INDIA_SHEET_ID,
      community: "Program & Project Management - India",
    },
    {
      id: PRODUCT_INDIA_SHEET_ID,
      community: "Product Management - India",
    },
    {
      id:  MARKETING_INDIA_SHEET_ID,
      community: "Marketing Management - India",
    },
    {
      id: CATEGORY_AND_VENDOR_INDIA_SHEET_ID,
      community: "Category and Vendor Management - India",
    },
    {
      id: SALES_AND_ACCOUNT_SHEET_ID,
      community: "Sales and Account Management - India",
    },
    {
      id: FINANCE_INDIA_SHEET_ID,
      community: "Finance - India",
    },
    {
      id: HUMAN_RESOURCES_INDIA_SHEET_ID,
      community: "Human Resources - India",
    },
    {
      id: ANALYTICS_INDIA_SHEET_ID,
      community: "Analytics - India",
    },
    {
      id: STRATEGY_INDIA_SHEET_ID,
      community: "Strategy and Consulting - India",
    }
    // Add more sheets here with their IDs and communities, e.g.
    // { id: '<ANOTHER SHEET ID>', community: 'Another Community' },
  ];

  for (const sheet of sheetsToProcess) {
    console.log(`Fetching data for spreadsheet ID: ${sheet.id}`);
    const data = await fetchData(sheet.id, SHEET_RANGE);
    console.log(`Fetched rows: ${data.length}`);

    for (const row of data) {
      const jobId = row['Job ID'] || row['Job ID ']; // fallback for extra space
      const job_description = row['About the Job'];
      if (jobId && jobId.trim()) {
        const trimmedJobId = jobId.trim();
        const title = 'Job Referral Opportunity';

        const message = `
<p><strong>Job ID:</strong> ${trimmedJobId}</p>
<p><strong>Company Name:</strong> ${row['Company Name']}</p>
<p><strong>Job Role:</strong> ${row['Job Title']}</p>
<p><strong>Location:</strong> ${row['Location']}</p>
<p>
  ${row["Hiring Manager's Name"]} is hiring for <strong>${row['Job Title']}</strong> at <strong>${row['Company Name']}</strong>.
</p>
<p>
  Refer Job Description for more details. If you find this role relevant and are interested to be referred, please send your CV to 
  <a href="mailto:support@jobreferral.club">support@jobreferral.club</a> mentioning <strong>Job ID: ${trimmedJobId}</strong> in the subject line. We will refer on your behalf.
</p>
<p><em>T&amp;C applied.</em></p>
`;

        console.log(`Creating post for Job ID: ${trimmedJobId} in community: ${sheet.community}`);
        await createPost(title, message, job_description, sheet.community);
      }
    }
  }
}

generatePostsAll();
