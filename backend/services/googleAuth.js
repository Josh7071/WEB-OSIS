const { google } = require('googleapis');
const path = require('path');

function resolveCredentials() {
  if (process.env.GOOGLE_CREDENTIALS) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
  }
  return path.join(__dirname, '..', 'credentials.json');
}

function getClient(scopes) {
  const auth = new google.auth.GoogleAuth({
    credentials: typeof resolveCredentials() === 'object' ? resolveCredentials() : undefined,
    keyFile: typeof resolveCredentials() === 'string' ? resolveCredentials() : undefined,
    scopes
  });
  return auth;
}

module.exports = { getClient };
