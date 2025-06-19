import 'dotenv/config';

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:4321';

// Replace this with your actual code from the URL
const code = process.argv[2];

if (!code) {
  console.error('Please provide the authorization code as an argument');
  console.error('Usage: node scripts/get-spotify-token.js YOUR_CODE');
  process.exit(1);
}

async function getRefreshToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('Error getting refresh token:', data.error);
    process.exit(1);
  }

  console.log('\nAdd this to your .env file:\n');
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
}

getRefreshToken().catch(console.error); 