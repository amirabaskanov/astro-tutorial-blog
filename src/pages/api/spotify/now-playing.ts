import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

export const GET: APIRoute = async ({ request }) => {
  const requestTime = new Date().toISOString();
  try {
    console.log(`[${requestTime}] API: Starting new request`);
    const response = await getNowPlayingResponse();
    console.log(`[${requestTime}] API: Got response:`, JSON.stringify(response, null, 2));
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // Prevent caching at all levels
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Netlify specific cache headers
        'Netlify-CDN-Cache-Control': 'no-store',
        'X-Request-Time': requestTime
      },
    });
  } catch (error) {
    console.error(`[${requestTime}] API: Error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data', timestamp: requestTime }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Netlify-CDN-Cache-Control': 'no-store',
        'X-Request-Time': requestTime
      },
    });
  }
}; 