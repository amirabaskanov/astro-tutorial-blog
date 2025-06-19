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
        <SpotifyIcon className="h-8 w-8 text-zinc-400 transition-colors hover:text-[#1DB954]" />
      </div>
    );
  }

  return (
    <a
      href={spotifyData.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full items-center gap-4 p-4"
    >
      <div className="relative shrink-0">
        <img
          src={spotifyData.albumImageUrl}
          alt={`${spotifyData.title} album art`}
          className={`h-16 w-16 rounded-lg object-cover shadow-md ${
            spotifyData.isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
          }`}
        />
        <SpotifyIcon className="absolute bottom-0 right-0 h-5 w-5 translate-x-1 translate-y-1 text-[#1DB954] drop-shadow-md" />
      </div>

      <div className="flex flex-col justify-center overflow-hidden">
        <p className="truncate text-sm font-medium text-zinc-100 group-hover:text-white">
          {spotifyData.title}
        </p>
        <p className="truncate text-xs text-zinc-400 group-hover:text-zinc-300">
          {spotifyData.artist}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {spotifyData.isPlaying ? 'Now Playing' : 'Last Played'}
        </p>
      </div>
    </a>
  );
}; 