import axios from "axios";
import { google } from "googleapis";
import path from "path";
import fs from "fs/promises";
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
} from "./config.mjs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyPath = path.join(__dirname, "job-details-google-credentials.json");
const LOG_FILE_PATH = path.join(__dirname, "lastJobIdLog.json");

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// Configuration
const BATCH_SIZE = 5; // Process 5 sheets concurrently
const POST_DELAY = 500; // 500ms between posts to avoid rate limiting
const SHEET_DELAY = 10000; // 10s between sheet batches (reduced from 60s)
const MAX_RETRIES = 3;
const USER_ID = "68983120b0b01c3a69f54851";
const API_ENDPOINT = "http://localhost:5000/api/posts/";

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

// Utility functions
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function loadLastJobIdLog() {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function saveLastJobIdLog(log) {
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(log, null, 2), "utf-8");
}

function isJobIdNewer(current, last) {
  if (!last) return true;
  return current.localeCompare(last) > 0;
}

function parseSalary(salaryRange) {
  if (!salaryRange) return null;
  const matches = salaryRange.match(/(\d[\d,]*)/g);
  if (matches && matches.length > 0) {
    return parseInt(matches[matches.length - 1].replace(/,/g, ""), 10);
  }
  return null;
}

function getFieldValue(row, ...keys) {
  for (const key of keys) {
    const found = Object.keys(row).find(
      (k) => k.replace(/\s/g, "").toLowerCase() === key.toLowerCase().replace(/\s/g, "")
    );
    if (found && row[found]) return row[found].trim();
  }
  return null;
}

function determineJobType(row) {
  let jt = (row["Job Type"] || "").toLowerCase();
  if (!jt) {
    const jobTitle = (row["Job Title"] || "").toLowerCase();
    if (jobTitle.includes("intern")) return "internship";
    if (jobTitle.includes("part-time")) return "part-time";
    return "full-time";
  }
  return jt;
}

function determineExperienceLevel(row) {
  const exp = (row["Years of experience"] || "").toLowerCase();
  if (exp.includes("intern") || exp.includes("fresher") || exp.includes("0")) return "intern";
  if (exp.includes("entry")) return "entry";
  if (exp.includes("mid")) return "mid";
  if (exp.includes("senior")) return "senior";
  if (exp.includes("director")) return "director";
  return "entry";
}

function buildJobMessage(row, jobId) {
  const jobLink = row["Job Link"];
  const salaryRange = row["Salary Range"]?.trim() || "";
  const yearsOfExpRaw = row["Years of experience"];
  const yearsOfExp =
    yearsOfExpRaw !== undefined &&
    yearsOfExpRaw !== null &&
    yearsOfExpRaw !== "" &&
    yearsOfExpRaw.toString().toLowerCase() !== "null"
      ? yearsOfExpRaw
      : null;

  const yearsExpText = yearsOfExp
    ? `<p><strong>Years of experience:</strong> ${yearsOfExp}</p>`
    : "";

  const hiringManagerName = row["Hiring Manager's Name"];
  const isHiringManagerMissing =
    !hiringManagerName ||
    hiringManagerName.toString().toLowerCase() === "null";

  if (isHiringManagerMissing) {
    return `<p><strong>Job ID:</strong> ${jobId}</p>
            <p><strong>Company Name:</strong> ${row["Company Name"]}</p>
            <p><strong>Job Role:</strong> ${row["Job Title"] || ""}</p>
            <p><strong>Location:</strong> ${row["Location"]}</p>
            ${yearsExpText}
            ${salaryRange ? `<p><strong>Salary Range:</strong> ${salaryRange}</p>` : ""}
            <p>Refer the 
              <a href="${jobLink}" target="_blank" rel="noopener noreferrer" style="color:#79E708;font-weight:600;text-decoration:underline;">
                Job Description
              </a> 
              for more details and apply.</p>`;
  }

  return `<p><strong>Job ID:</strong> ${jobId}</p>
          <p><strong>Company Name:</strong> ${row["Company Name"]}</p>
          <p><strong>Job Role:</strong> ${row["Job Title"] || ""}</p>
          <p><strong>Location:</strong> ${row["Location"]}</p>
          ${yearsExpText}
          ${
            salaryRange && salaryRange !== "0"
              ? `<p><strong>Salary Range:</strong> ${salaryRange}</p>`
              : `<p><strong>Salary Range:</strong> Not disclosed</p>`
          }
          <p>${hiringManagerName} is hiring for <strong>${row["Job Title"] || ""}</strong> at <strong>${row["Company Name"]}</strong>.</p>
          <p>Refer the 
            <a href="${jobLink}" target="_blank" rel="noopener noreferrer" style="color:#79E708;font-weight:600;text-decoration:underline;">
              Job Description
            </a> 
            for more details. If you find this role relevant and are interested to be referred, please send your CV to 
            <a href="mailto:support@jobreferral.club">support@jobreferral.club</a> mentioning <strong>Job ID: ${jobId}</strong> in the subject line. We will refer on your behalf.
          </p>
          <p><em><a href="https://jobreferral.club/community/club-guidelines" target="_blank" rel="noopener noreferrer">T&amp;C applied.</a></em></p>`;
}

async function fetchData(spreadsheetId, range) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const [headers, ...rows] = result.data.values;
  console.log(`DEBUG: [${spreadsheetId}] headers: [${headers.join(", ")}]`);
  return rows.map((row) => {
    let obj = {};
    headers.forEach((header, i) => (obj[header.trim()] = row[i] || ""));
    return obj;
  });
}

async function createPost(postData, maxRetries = MAX_RETRIES) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await axios.post(API_ENDPOINT, postData, {
        timeout: 10000,
      });
      console.log(
        `[POST SUCCESS] ${postData.community}: JobID ${response.data._id}`
      );
      return true;
    } catch (error) {
      attempt++;
      if (error.response) {
        console.error(
          `[POST ERROR] Attempt ${attempt} - API error (${error.response.status}):`,
          error.response.data
        );
      } else if (error.request) {
        console.error(
          `[POST ERROR] Attempt ${attempt} - No response:`,
          error.message
        );
      } else {
        console.error(
          `[POST ERROR] Attempt ${attempt} - Setup error:`,
          error.message
        );
      }
      if (attempt < maxRetries) {
        const backoff = 500 * Math.pow(2, attempt);
        console.log(`[POST RETRY] Retrying after ${backoff}ms...`);
        await delay(backoff);
      } else {
        console.error("[POST ABORT] Max retries reached, skipping.");
        return false;
      }
    }
  }
}

function buildPostData(row, jobId, community) {
  const job_description = row["About the Job"] || row["Job Description"] || "";
  const message = buildJobMessage(row, jobId);
  
  const salaryMinRaw = row["Salary Min"] || row["salary min"];
  const salaryMaxRaw = row["Salary Max"] || row["salary max"];
  const salaryMin = salaryMinRaw ? Number(salaryMinRaw) : null;
  const salaryMax = salaryMaxRaw ? Number(salaryMaxRaw) : null;

  return {
    title: "Job Referral Opportunity",
    content: message,
    job_description,
    community,
    userId: USER_ID,
    type: "job-posting",
    location: row["Location"]?.trim() || null,
    companyName: row["Company Name"]?.trim() || null,
    salary: parseSalary(row["Salary Range"]),
    salaryMin,
    salaryMax,
    jobType: determineJobType(row),
    experienceLevel: determineExperienceLevel(row),
    jobTitle: row["Job Title"]?.trim() || null,
  };
}

async function processSheet(sheet, lastJobIdLog) {
  console.log(`\n--- Processing: ${sheet.community} ---`);
  
  try {
    const data = await fetchData(sheet.id, SHEET_RANGE);
    console.log(`Fetched ${data.length} rows`);
    
    if (data.length === 0) {
      console.log(`[SKIP] No data in sheet`);
      return { processed: 0, posted: 0 };
    }

    if (!lastJobIdLog[sheet.community]) {
      lastJobIdLog[sheet.community] = null;
    }

    let processed = 0;
    let posted = 0;

    for (const row of data) {
      const jobIdKey = Object.keys(row).find(
        (k) => k.replace(/\s/g, "").toLowerCase() === "jobid"
      );
      const jobId = jobIdKey ? (row[jobIdKey] || "").trim() : "";
      
      if (!jobId) {
        console.log(`[SKIP] Empty jobId in row`);
        continue;
      }

      if (!isJobIdNewer(jobId, lastJobIdLog[sheet.community])) {
        console.log(`[SKIP] Job ID ${jobId} already processed`);
        continue;
      }

      processed++;
      const postData = buildPostData(row, jobId, sheet.community);
      
      console.log(`[CREATE] JobID: ${jobId}`);
      const success = await createPost(postData);

      if (success) {
        posted++;
        lastJobIdLog[sheet.community] = jobId;
        await saveLastJobIdLog(lastJobIdLog);
        console.log(`[SAVED] Updated lastJobId => ${jobId}`);
      }

      // Small delay between posts to avoid overwhelming the API
      if (processed < data.length) {
        await delay(POST_DELAY);
      }
    }

    return { processed, posted };
  } catch (error) {
    console.error(`[ERROR] Failed to process sheet ${sheet.community}:`, error.message);
    return { processed: 0, posted: 0, error: true };
  }
}

async function processBatch(sheets, lastJobIdLog) {
  const results = await Promise.allSettled(
    sheets.map(sheet => processSheet(sheet, lastJobIdLog))
  );
  
  return results.map((result, index) => ({
    community: sheets[index].community,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}

export async function generatePostsAll() {
  console.log(`\n=== Starting Job Post Generation ===`);
  console.log(`Total sheets to process: ${sheetsToProcess.length}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  
  const lastJobIdLog = await loadLastJobIdLog();
  console.log(`\n=== Loaded lastJobIdLog ===`);
  Object.entries(lastJobIdLog).forEach(([k, v]) => {
    console.log(`  "${k}" => ${v}`);
  });

  let totalProcessed = 0;
  let totalPosted = 0;
  let totalErrors = 0;

  // Process sheets in batches
  for (let i = 0; i < sheetsToProcess.length; i += BATCH_SIZE) {
    const batch = sheetsToProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(sheetsToProcess.length / BATCH_SIZE);
    
    console.log(`\n\n=== Batch ${batchNum}/${totalBatches} ===`);
    console.log(`Processing sheets: ${batch.map(s => s.community).join(", ")}`);
    
    const results = await processBatch(batch, lastJobIdLog);
    
    // Aggregate results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.data) {
        totalProcessed += result.data.processed || 0;
        totalPosted += result.data.posted || 0;
        if (result.data.error) totalErrors++;
      } else {
        totalErrors++;
        console.error(`[ERROR] ${result.community}: ${result.error}`);
      }
    });

    // Wait between batches (except after the last batch)
    if (i + BATCH_SIZE < sheetsToProcess.length) {
      console.log(`\n[WAIT] Waiting ${SHEET_DELAY/1000}s before next batch...`);
      await delay(SHEET_DELAY);
    }
  }

  console.log(`\n\n=== Generation Complete ===`);
  console.log(`Total jobs processed: ${totalProcessed}`);
  console.log(`Total jobs posted: ${totalPosted}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Success rate: ${totalProcessed > 0 ? ((totalPosted/totalProcessed)*100).toFixed(1) : 0}%`);
}

// Run the import
generatePostsAll();