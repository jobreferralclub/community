import fs from 'fs';

const credentials = {
  type: process.env.JOB_GCP_TYPE,
  project_id: process.env.JOB_GCP_PROJECT_ID,
  private_key_id: process.env.JOB_GCP_PRIVATE_KEY_ID,
  private_key: process.env.JOB_GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.JOB_GCP_CLIENT_EMAIL,
  client_id: process.env.JOB_GCP_CLIENT_ID,
  auth_uri: process.env.JOB_GCP_AUTH_URI,
  token_uri: process.env.JOB_GCP_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.JOB_GCP_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.JOB_GCP_CLIENT_CERT_URL,
  universe_domain: process.env.JOB_GCP_UNIVERSE_DOMAIN,
};

const filePath = './job-details-google-credentials.json';

try {
  fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  console.log(`Created credentials file at ${filePath}`);
} catch (error) {
  console.error('Error writing credentials file:', error);
}
