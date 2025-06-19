import { useEffect, useState } from 'react';
import { SpotifyIcon } from '../icons/Spotify';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

export function BentoItemNowPlaying() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/spotify/now-playing?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('New Spotify data:', data);
      
      if (data && data.title) {
        // Only update if the data is different
        setSpotifyData(prev => {
          if (!prev || prev.title !== data.title || prev.isPlaying !== data.isPlaying) {
            return data;
          }
          return prev;
        });
      } else {
        setError('No track data available');
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setError('Failed to fetch track data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 20000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error || !spotifyData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Unable to load track data</p>
      </div>
    );
  }

  return (
    <a
      href={spotifyData.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full items-center px-0"
    >
      <img
        src={spotifyData.albumImageUrl}
        alt={`${spotifyData.title} album art`}
        className="h-[90px] w-[90px] rounded-lg object-cover"
      />

      <div className="ml-4 flex flex-col justify-center space-y-1.5 overflow-hidden">
        <p className={`text-xs ${
          spotifyData.isPlaying ? 'animate-[pulse_2s_ease-in-out_infinite] text-white' : 'text-slate-400'
        }`}>
          {spotifyData.isPlaying ? 'Now Playing' : 'Last Played'}
        </p>
        <p className="truncate text-sm font-medium text-white">
          {spotifyData.title}
        </p>
        <p className="truncate text-xs text-slate-400">
          {spotifyData.artist}
        </p>
      </div>

      <div className="absolute -right-2 -top-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 z-10 border border-white/10">
          <SpotifyIcon className="h-4 w-4 text-white group-hover:text-[#1DB954]" />
        </div>
      </div>
    </a>
  );
} 