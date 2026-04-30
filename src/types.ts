
export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number; // in seconds
}

export const DUMMY_PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Neon Lilypad',
    artist: 'CyberCroak AI',
    cover: 'https://picsum.photos/seed/neon1/400/400',
    duration: 185
  },
  {
    id: '2',
    title: 'Swamp Synth',
    artist: 'GrooveFrog',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    duration: 210
  },
  {
    id: '3',
    title: 'Ribbit Echoes',
    artist: 'The Mashup Tadpoles',
    cover: 'https://picsum.photos/seed/neon3/400/400',
    duration: 142
  }
];
