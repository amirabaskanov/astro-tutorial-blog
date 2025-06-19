import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

export const GET: APIRoute = async ({ request }) => {
  try {
    const response = await getNowPlayingResponse();
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Tell browsers not to cache
        'Cache-Control': 'no-cache',
        // Tell Netlify to cache for 1 second
        'CDN-Cache-Control': 'public, max-age=1',
        // Tell Netlify to vary the cache by the entire URL including query params
        'Netlify-Vary': 'query',
        // Add CORS headers
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'CDN-Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 