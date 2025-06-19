import { z } from 'zod';

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
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

  console.log('Getting access token...');
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

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get access token:', error);
    throw new Error(`Failed to get access token: ${error}`);
  }

  return response.json();
};

export const getNowPlayingResponse = async (): Promise<SpotifyData | null> => {
  try {
    const { access_token } = await getAccessToken();
    console.log('Got access token, fetching now playing...');

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
    });

    if (response.status === 204) {
      console.log('No track currently playing, fetching recently played...');
      return getRecentlyPlayed();
    }

    const json = await response.json();
    const result = spotifyTrackSchema.safeParse(json);

    if (!result.success || !result.data.item) {
      console.log('Invalid track data or no item, fetching recently played...');
      return getRecentlyPlayed();
    }

    return mapSpotifyData(result.data);
  } catch (error) {
    console.error('Error in getNowPlayingResponse:', error);
    throw error;
  }
};

export const getRecentlyPlayed = async (): Promise<SpotifyData | null> => {
  try {
    const { access_token } = await getAccessToken();
    console.log('Fetching recently played tracks...');

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
    });

    console.log('Recently played status:', response.status);
    if (response.status === 204 || response.status > 400) {
      console.error('Error response from recently played:', response.status);
      return null;
    }

    const json = await response.json();
    console.log('Recently played raw response:', json);
    
    const result = spotifyRecentlyPlayedSchema.safeParse(json);
    if (!result.success) {
      console.error('Failed to parse recently played:', result.error);
      return null;
    }

    if (!result.data.items.length) {
      console.log('No recently played tracks found');
      return null;
    }

    return {
      isPlaying: false,
      title: result.data.items[0].track.name,
      artist: result.data.items[0].track.artists.map(artist => artist.name).join(', '),
      albumImageUrl: result.data.items[0].track.album.images[0]?.url,
      songUrl: result.data.items[0].track.external_urls.spotify,
    };
  } catch (error) {
    console.error('Error in getRecentlyPlayed:', error);
    return null;
  }
};

const mapSpotifyData = (data: z.infer<typeof spotifyTrackSchema>): SpotifyData => {
  if (!data.item) {
    throw new Error('No track data available');
  }

  return {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map(artist => artist.name).join(', '),
    albumImageUrl: data.item.album.images[0]?.url,
    songUrl: data.item.external_urls.spotify,
  };
}; 