const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function getRefreshToken(clientId: string, clientSecret: string, code: string) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:4321',
    }),
  });

  const data = await response.json();
  if (data.error) {
    console.error('Error from Spotify:', data);
    throw new Error(data.error_description || data.error);
  }
  console.log('Full response:', data);
  console.log('\nYour refresh token is:', data.refresh_token);
  return data.refresh_token;
}

const [clientId, clientSecret, code] = process.argv.slice(2);

if (!clientId || !clientSecret || !code) {
  console.error('Please provide all required arguments:');
  console.error('npx tsx src/scripts/getSpotifyToken.ts CLIENT_ID CLIENT_SECRET CODE');
  process.exit(1);
}

getRefreshToken(clientId, clientSecret, code)
  .catch(error => {
    console.error('Error getting refresh token:', error);
    process.exit(1);
  }); 