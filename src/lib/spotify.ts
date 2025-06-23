import { z } from 'zod';

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Cache for recently played track
let recentlyPlayedCache: SpotifyData | null = null;
let lastRecentlyPlayedFetch = 0;
const CACHE_DURATION = 60000; // 1 minute cache

// Simplified schemas focusing on essential data
const trackSchema = z.object({
  name: z.string(),
  external_urls: z.object({
    spotify: z.string().url(),
  }),
  album: z.object({
    images: z.array(
      z.object({
        url: z.string().url(),
      })
    ),
  }),
  artists: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

const nowPlayingSchema = z.object({
  is_playing: z.boolean(),
  item: trackSchema.nullable(),
});

const recentlyPlayedSchema = z.object({
  items: z.array(
    z.object({
      track: trackSchema,
    })
  ),
});

export type SpotifyData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
};

const getAccessToken = async () => {
  const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;
  const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
  const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  if (!refresh_token || !client_id || !client_secret) {
    throw new Error('Missing required Spotify credentials in environment variables');
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

const mapTrackToSpotifyData = (track: z.infer<typeof trackSchema>, isPlaying: boolean): SpotifyData => ({
  isPlaying,
  title: track.name,
  artist: track.artists.map(artist => artist.name).join(', '),
  albumImageUrl: track.album.images[0]?.url,
  songUrl: track.external_urls.spotify,
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRecentlyPlayed = async (access_token: string, retryCount = 0): Promise<SpotifyData> => {
  // Check cache first
  const now = Date.now();
  if (recentlyPlayedCache && (now - lastRecentlyPlayedFetch) < CACHE_DURATION) {
    return recentlyPlayedCache;
  }

  try {
    const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Handle rate limiting with exponential backoff
    if (response.status === 429 && retryCount < 3) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
      await sleep(retryAfter * 1000);
      return getRecentlyPlayed(access_token, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played tracks: ${response.status}`);
    }

    const data = await response.json();
    const parsedData = recentlyPlayedSchema.parse(data);
    
    if (parsedData.items.length === 0) {
      throw new Error('No recently played tracks found');
    }

    // Update cache
    const spotifyData = mapTrackToSpotifyData(parsedData.items[0].track, false);
    recentlyPlayedCache = spotifyData;
    lastRecentlyPlayedFetch = now;

    return spotifyData;
  } catch (error) {
    // If we have cached data and encounter an error, return cached data
    if (recentlyPlayedCache) {
      return recentlyPlayedCache;
    }
    throw error;
  }
};

export const getNowPlayingResponse = async (): Promise<SpotifyData> => {
  const { access_token } = await getAccessToken();

  try {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // If no track is playing (status 204), get recently played
    if (response.status === 204) {
      return getRecentlyPlayed(access_token);
    }

    // Handle rate limiting for now playing endpoint
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
      await sleep(retryAfter * 1000);
      return getNowPlayingResponse(); // Retry the entire operation
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch now playing: ${response.status}`);
    }

    const data = await response.json();
    const parsedData = nowPlayingSchema.parse(data);
    
    // If no current track, get recently played
    if (!parsedData.item) {
      return getRecentlyPlayed(access_token);
    }

    // When we successfully get a now playing track, also update the recently played cache
    // This helps keep the cache fresh for when we need it
    recentlyPlayedCache = mapTrackToSpotifyData(parsedData.item, false);
    lastRecentlyPlayedFetch = Date.now();

    return mapTrackToSpotifyData(parsedData.item, true);
  } catch (error) {
    // If we have a cached recently played track, use it as fallback
    if (recentlyPlayedCache) {
      return recentlyPlayedCache;
    }
    throw error;
  }
}; 