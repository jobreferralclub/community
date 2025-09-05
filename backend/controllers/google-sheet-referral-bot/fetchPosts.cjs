const axios = require('axios');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs').promises;
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

  OPERATIONS_US_SHEET_ID,
  PROGRAM_AND_PROJECT_US_SHEET_ID,
  PRODUCT_US_SHEET_ID,
  MARKETING_US_SHEET_ID,
  CATEGORY_AND_VENDOR_US_SHEET_ID,
  SALES_AND_ACCOUNT_US_SHEET_ID,
  FINANCE_US_SHEET_ID,
  HUMAN_RESOURCES_US_SHEET_ID,
  ANALYTICS_US_SHEET_ID,
  STRATEGY_US_SHEET_ID,
  SHEET_RANGE,
} = require('./config.cjs');

const keyPath = path.join(__dirname, 'credentials.json');
const LOG_FILE_PATH = path.join(__dirname, 'lastJobIdLog.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Load the last posted Job ID log from file or initialize empty object
async function loadLastJobIdLog() {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return {}; // no file yet, return empty
    throw error;
  }
}

// Save updated last posted Job ID log to file
async function saveLastJobIdLog(log) {
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(log, null, 2), 'utf-8');
}

// Check if current jobId is lexically greater (newer) than last posted
function isJobIdNewer(current, last) {
  if (!last) return true; // no previous job, so current is new
  return current.localeCompare(last) > 0;
}

// Fetch data from Google Sheets
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

// Create post by calling backend API with retries and detailed logging
async function createPost(title, content, job_description, community, maxRetries = 3) {
  let attempt = 0;
  const delay = ms => new Promise(res => setTimeout(res, ms));

  while (attempt < maxRetries) {
    try {
      const response = await axios.post('http://localhost:5000/api/posts/', {
        title,
        content,
        userId: '68983120b0b01c3a69f54851', // Adjust if needed
        community,
        job_description,
        type: "job-posting",
      }, {
        timeout: 10000 // 10 seconds
      });

      console.log(`Post created: ${response.data._id}`);
      return true;

    } catch (error) {
      attempt++;
      if (error.response) {
        console.error(`Attempt ${attempt} - API error (${error.response.status}):`, error.response.data);
      } else if (error.request) {
        console.error(`Attempt ${attempt} - No response received:`, error.message);
      } else {
        console.error(`Attempt ${attempt} - Request setup error:`, error.message);
      }

      if (attempt < maxRetries) {
        const backoff = 500 * Math.pow(2, attempt); // exponential backoff: 1s, 2s, 4s
        console.log(`Retrying after ${backoff}ms...`);
        await delay(backoff);
      } else {
        console.error('Max retries reached, skipping this job post.');
        return false;
      }
    }
  }
}

// List of sheets with spreadsheet IDs and community names
const sheetsToProcess = [
  { id: OPERATIONS_INDIA_SHEET_ID, community: "Operations & Supply Chain - India" },
  { id: PROGRAM_AND_PROJECT_INDIA_SHEET_ID, community: "Program & Project Management - India" },
  { id: PRODUCT_INDIA_SHEET_ID, community: "Product Management - India" },
  { id: MARKETING_INDIA_SHEET_ID, community: "Marketing Management - India" },
  { id: CATEGORY_AND_VENDOR_INDIA_SHEET_ID, community: "Category and Vendor Management - India" },
  { id: SALES_AND_ACCOUNT_SHEET_ID, community: "Sales and Account Management - India" },
  { id: FINANCE_INDIA_SHEET_ID, community: "Finance - India" },
  { id: HUMAN_RESOURCES_INDIA_SHEET_ID, community: "Human Resources - India" },
  { id: ANALYTICS_INDIA_SHEET_ID, community: "Analytics - India" },
  { id: STRATEGY_INDIA_SHEET_ID, community: "Strategy and Consulting - India" },

  { id: OPERATIONS_US_SHEET_ID, community: "Operations & Supply Chain - US" },
  { id: PROGRAM_AND_PROJECT_US_SHEET_ID, community: "Program & Project Management - US" },
  { id: PRODUCT_US_SHEET_ID, community: "Product Management - US" },
  { id: MARKETING_US_SHEET_ID, community: "Marketing Management - US" },
  { id: CATEGORY_AND_VENDOR_US_SHEET_ID, community: "Category and Vendor Management - US" },
  { id: SALES_AND_ACCOUNT_US_SHEET_ID, community: "Sales and Account Management - US" },
  { id: FINANCE_US_SHEET_ID, community: "Finance - US" },
  { id: HUMAN_RESOURCES_US_SHEET_ID, community: "Human Resources - US" },
  { id: ANALYTICS_US_SHEET_ID, community: "Analytics - US" },
  { id: STRATEGY_US_SHEET_ID, community: "Strategy and Consulting - US" },
];

// Main function to generate posts ensuring no duplicates and starting from the next job ID
async function generatePostsAll() {
  const lastJobIdLog = await loadLastJobIdLog();

  for (const sheet of sheetsToProcess) {
    console.log(`Fetching data for spreadsheet ID: ${sheet.id}`);
    const data = await fetchData(sheet.id, SHEET_RANGE);
    console.log(`Fetched rows: ${data.length}`);

    if (!lastJobIdLog[sheet.community]) lastJobIdLog[sheet.community] = null;

    // Process posts sequentially for concurrency control and stability
    for (const row of data) {
      const jobId = (row['Job ID'] || row['Job ID '] || '').trim();
      if (!jobId) continue;

      if (!isJobIdNewer(jobId, lastJobIdLog[sheet.community])) {
        console.log(`Skipping Job ID ${jobId} <= last posted Job ID ${lastJobIdLog[sheet.community]}`);
        continue;
      }

      const title = 'Job Referral Opportunity';
      const job_description = row['About the Job'];
      const message = `
<p><strong>Job ID:</strong> ${jobId}</p>
<p><strong>Company Name:</strong> ${row['Company Name']}</p>
<p><strong>Job Role:</strong> ${row['Job Title']}</p>
<p><strong>Location:</strong> ${row['Location']}</p>
<p>${row["Hiring Manager's Name"]} is hiring for <strong>${row['Job Title']}</strong> at <strong>${row['Company Name']}</strong>.</p>
<p>Refer Job Description for more details. If you find this role relevant and are interested to be referred, please send your CV to
<a href="mailto:support@jobreferral.club">support@jobreferral.club</a> mentioning <strong>Job ID: ${jobId}</strong> in the subject line. We will refer on your behalf.</p>
<p><em>T&amp;C applied.</em></p>
`;

      console.log(`Creating post for Job ID: ${jobId} in community: ${sheet.community}`);

      const success = await createPost(title, message, job_description, sheet.community);

      if (success) {
        lastJobIdLog[sheet.community] = jobId;
        await saveLastJobIdLog(lastJobIdLog);
      }
    }
  }
}

// Start the process
generatePostsAll();
