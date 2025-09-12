import axios from 'axios';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import {
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
  FRESHERS_INDIA_SHEET_ID,

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
} from './config.mjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// for __dirname replacement in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyPath = path.join(__dirname, 'credentials.json');
const LOG_FILE_PATH = path.join(__dirname, 'lastJobIdLog.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function loadLastJobIdLog() {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

async function saveLastJobIdLog(log) {
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(log, null, 2), 'utf-8');
}

function isJobIdNewer(current, last) {
  if (!last) return true;
  return current.localeCompare(last) > 0;
}

async function fetchData(spreadsheetId, range) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const [headers, ...rows] = result.data.values;
  console.log(`DEBUG: [${spreadsheetId}] headers: [${headers.join(', ')}]`);
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => (obj[header.trim()] = row[i] || ""));
    return obj;
  });
}

async function createPost(title, content, job_description, community, maxRetries = 3) {
  let attempt = 0;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  while (attempt < maxRetries) {
    try {
      const response = await axios.post('http://localhost:5000/api/posts/', {
        title,
        content,
        userId: '68983120b0b01c3a69f54851',
        community,
        job_description,
        type: "job-posting",
      }, {
        timeout: 10000
      });
      console.log(`[POST SUCCESS] ${community}: JobID ${response.data._id}`);
      return true;
    } catch (error) {
      attempt++;
      if (error.response) {
        console.error(`[POST ERROR] Attempt ${attempt} - API error (${error.response.status}):`, error.response.data);
      } else if (error.request) {
        console.error(`[POST ERROR] Attempt ${attempt} - No response received:`, error.message);
      } else {
        console.error(`[POST ERROR] Attempt ${attempt} - Request setup error:`, error.message);
      }
      if (attempt < maxRetries) {
        const backoff = 500 * Math.pow(2, attempt);
        console.log(`[POST RETRY] Retrying after ${backoff}ms...`);
        await delay(backoff);
      } else {
        console.error('[POST ABORT] Max retries reached, skipping this job post.');
        return false;
      }
    }
  }
}

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
  { id: FRESHERS_INDIA_SHEET_ID, community: "Freshers - India" },
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


export async function generatePostsAll() {
  const lastJobIdLog = await loadLastJobIdLog();
  console.log("\n=== Debug: lastJobIdLog loaded ===");
  Object.entries(lastJobIdLog).forEach(([k, v]) => {
    console.log(`  "${k}" => ${v}`);
  });

  for (const sheet of sheetsToProcess) {
    console.log(`\n--- Fetching data for spreadsheet ID: ${sheet.id} (${sheet.community}) ---`);
    const data = await fetchData(sheet.id, SHEET_RANGE);
    console.log(`Fetched rows: ${data.length}`);
    if (data.length > 0) {
      console.log(`Row keys in first row: ${Object.keys(data[0]).join(', ')}`);
    }

    if (!lastJobIdLog[sheet.community]) lastJobIdLog[sheet.community] = null;

    for (const row of data) {
      const jobIdKey = Object.keys(row).find(
        k => k.replace(/\s/g, '').toLowerCase() === 'jobid'
      );
      const jobId = jobIdKey ? (row[jobIdKey] || '').trim() : '';
      if (!jobId) {
        console.log(`[DEBUG] Empty jobId in ${sheet.community}: Row keys=[${Object.keys(row).join(', ')}], Raw row=`, row);
        continue;
      }

      if (!isJobIdNewer(jobId, lastJobIdLog[sheet.community])) {
        console.log(`[SKIP] Job ID ${jobId} <= last posted Job ID ${lastJobIdLog[sheet.community]} (${sheet.community})`);
        continue;
      }

      if (sheet.community === "Freshers - India") {
        console.log(`[DEBUG] Freshers - Checking JobID: "${jobId}" vs Last: "${lastJobIdLog[sheet.community]}"`);
        console.log(`[DEBUG] Freshers - isJobIdNewer result: ${isJobIdNewer(jobId, lastJobIdLog[sheet.community])}`);
      }

      const title = 'Job Referral Opportunity';
      const job_description = row['About the Job'] || row['Job Description'] || '';
      const message = `
<p><strong>Job ID:</strong> ${jobId}</p>
<p><strong>Company Name:</strong> ${row['Company Name']}</p>
<p><strong>Job Role:</strong> ${row['Job Title'] || ''}</p>
<p><strong>Location:</strong> ${row['Location']}</p>
<p>${row["Hiring Manager's Name"]} is hiring for <strong>${row['Job Title'] || ''}</strong> at <strong>${row['Company Name']}</strong>.</p>
<p>Refer Job Description for more details. If you find this role relevant and are interested to be referred, please send your CV to
<a href="mailto:support@jobreferral.club">support@jobreferral.club</a> mentioning <strong>Job ID: ${jobId}</strong> in the subject line. We will refer on your behalf.</p>
<p><em>T&amp;C applied.</em></p>
`;

      console.log(`[CREATE] Creating post for Job ID: ${jobId} in community: ${sheet.community}`);
      const success = await createPost(title, message, job_description, sheet.community);

      console.log(`[RESULT] Post for JobID ${jobId} (${sheet.community}) => ${success}`);

      if (success) {
        lastJobIdLog[sheet.community] = jobId;
        await saveLastJobIdLog(lastJobIdLog);
        console.log(`[SAVED] Updated lastJobId for "${sheet.community}" => ${jobId}`);
      }
    }
  }
}
