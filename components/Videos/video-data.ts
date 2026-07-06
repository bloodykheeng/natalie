export type GenreKey = 'jazz' | 'gothic' | 'rock' | 'screen';

export type Video = {
  /** YouTube video ID */
  id: string;
  /** Song title (proper noun — same in every locale) */
  title: string;
  genreKey: GenreKey;
  featured?: boolean;
};

// Real videos from https://www.youtube.com/@Northern_skyy
export const videos: Video[] = [
  {
    id: '_Co42uBTNuQ',
    title: 'Lacuna Coil — Swamped',
    genreKey: 'gothic',
    featured: true
  },
  { id: 'YktT4iVr3Lw', title: 'Dream a Little Dream of Me', genreKey: 'jazz' },
  { id: 'mNNX74CnBJE', title: 'Come What May — Moulin Rouge!', genreKey: 'screen' },
  { id: 'BV8_FqUuJEc', title: 'Myrkur — Harpens Kraft', genreKey: 'gothic' },
  { id: 'OLaK5OdZSYU', title: 'Happy Time — Bob Crosby', genreKey: 'jazz' },
  { id: 'qKzYaVlOFG4', title: 'Fleetwood Mac — Rhiannon', genreKey: 'rock' },
  { id: 'YKteTOGIc00', title: 'Juice Newton — Angel of the Morning', genreKey: 'rock' },
  { id: '_NVKQWU9EkU', title: "Lesley Gore — It's My Party", genreKey: 'rock' },
  { id: 'yjPWLFOlbyE', title: 'Carina Round — Do You', genreKey: 'screen' }
];
