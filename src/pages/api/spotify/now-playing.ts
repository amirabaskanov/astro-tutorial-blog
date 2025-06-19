import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

export const GET: APIRoute = async ({ request }) => {
  const requestTime = new Date().toISOString();
  try {
    console.log(`[${requestTime}] API: Starting new request`);
    const response = await getNowPlayingResponse();
    console.log(`[${requestTime}] API: Got response:`, JSON.stringify(response, null, 2));
    
    // Create a unique ETag for this response
    const etag = `${Date.now()}-${Math.random()}`;
    
    return new Response(JSON.stringify({ ...response, _timestamp: requestTime }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, private, no-cache, must-revalidate, proxy-revalidate',
        'Surrogate-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': etag,
        'Vary': '*',
        'X-Request-Time': requestTime
      },
    });
  } catch (error) {
    console.error(`[${requestTime}] API: Error:`, error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch Spotify data', 
      timestamp: requestTime,
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, private, no-cache, must-revalidate, proxy-revalidate',
        'Surrogate-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': '*',
        'X-Request-Time': requestTime
      },
    });
  }
}; 