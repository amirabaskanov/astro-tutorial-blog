import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
  'CDN-Cache-Control': 'no-store',
  'Netlify-Vary': 'query',
  'Access-Control-Allow-Origin': '*'
};

export const GET: APIRoute = async () => {
  try {
    const response = await getNowPlayingResponse();
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching Spotify data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Spotify data',
        details: errorMessage
      }), 
      {
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}; 