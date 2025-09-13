import fs from 'fs';

const credentials = {
  type: process.env.GCP_TYPE,
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.GCP_PRIVATE_KEY_ID,
  private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GCP_CLIENT_EMAIL,
  client_id: process.env.GCP_CLIENT_ID,
  auth_uri: process.env.GCP_AUTH_URI,
  token_uri: process.env.GCP_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
  universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
};

const filePath = './role-credentials.json'; // change path if needed

try {
  fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  console.log(`Created credentials file at ${filePath}`);
} catch (error) {
  console.error('Error writing credentials file:', error);
}
