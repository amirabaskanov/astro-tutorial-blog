import type { APIRoute } from 'astro';
import { getNowPlayingResponse } from '../../../lib/spotify';

export const GET: APIRoute = async () => {
  try {
    const response = await getNowPlayingResponse();
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600, durable',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 