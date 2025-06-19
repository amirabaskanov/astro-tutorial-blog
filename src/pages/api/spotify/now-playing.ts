import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

export const GET: APIRoute = async () => {
  try {
    console.log('API: Fetching Spotify data...');
    console.log('API: Environment variables check:', {
      hasClientId: !!import.meta.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!import.meta.env.SPOTIFY_CLIENT_SECRET,
      hasRefreshToken: !!import.meta.env.SPOTIFY_REFRESH_TOKEN,
    });
    
    const response = await getNowPlayingResponse();
    console.log('API: Spotify response received');
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers to ensure the API is accessible
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('API: Error fetching Spotify data:', error);
    if (error instanceof Error) {
      console.error('API: Error details:', error.message);
      console.error('API: Error stack:', error.stack);
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}; 