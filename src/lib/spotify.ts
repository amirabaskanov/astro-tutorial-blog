import { z } from 'zod';

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const spotifyTrackSchema = z.object({
  is_playing: z.boolean(),
  item: z.object({
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
  }).nullable(),
});

const spotifyRecentlyPlayedSchema = z.object({
  items: z.array(
    z.object({
      track: z.object({
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
      }),
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

const mapSpotifyData = (track: any) => {
  return {
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    albumImageUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  };
};

const getRecentlyPlayed = async (access_token: string): Promise<SpotifyData> => {
  // Get current timestamp in milliseconds
  const now = Date.now();
  const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1&before=${now}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recently played tracks: ${response.status}`);
  }

  const data = await response.json();
  
  // Validate the response has items
  if (!data.items?.length) {
    throw new Error('No recently played tracks found');
  }

  const { track } = data.items[0];
  
  if (!track) {
    throw new Error('Invalid track data in recently played response');
  }

  try {
    return {
      isPlaying: false,
      ...mapSpotifyData(track)
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to map recently played track data: ${errorMessage}`);
  }
};

export const getNowPlayingResponse = async (): Promise<SpotifyData> => {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (response.status === 204) {
    return getRecentlyPlayed(access_token);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch now playing: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.item) {
    return getRecentlyPlayed(access_token);
  }

  try {
    return {
      isPlaying: true,
      ...mapSpotifyData(data.item)
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to map now playing track data: ${errorMessage}`);
  }
}; 