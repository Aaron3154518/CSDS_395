import fetch from 'node-fetch';

const clientId = '5d369fb2e69e43e186efae6b4de10a68'; // replace with your client ID
const clientSecret = 'b4502636b2684379add901bed496a7c4'; // replace with your client secret

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
};

async function getAccessToken(): Promise<string> {
  const url = 'https://accounts.spotify.com/api/token';

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const authHeader = `Basic ${basicAuth}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (response.ok) {
    const data: TokenResponse = await response.json();
    console.log('Access token:', data.access_token);
    return data.access_token;
  } else {
    console.error('Failed to get access token:', response.statusText);
    return '';
  }
}

getAccessToken();
