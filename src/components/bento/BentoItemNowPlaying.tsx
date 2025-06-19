import useSWR from 'swr';
import type { SpotifyData } from '../../lib/spotify';
import { SpotifyIcon } from '../icons/Spotify';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch Spotify data');
  }
  return res.json();
};

type Props = {
  initialData?: SpotifyData | null;
};

export const BentoItemNowPlaying = ({ initialData }: Props) => {
  const { data: spotifyData } = useSWR<SpotifyData | null>(
    '/api/spotify/now-playing',
    fetcher,
    {
      refreshInterval: 10000,
      fallbackData: initialData,
    }
  );

  if (!spotifyData) {
    return (
      <div className="flex h-full items-center justify-center">
        <SpotifyIcon className="h-8 w-8 text-white transition-colors hover:text-[#1DB954]" />
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
        className={`h-[90px] w-[90px] rounded-lg object-cover ${
          // spotifyData.isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
          spotifyData.isPlaying ? '' : ''
        }`}
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
}; 