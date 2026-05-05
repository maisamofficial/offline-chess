// Consolidated Chess Bots: Easy, Normal, Expert

export interface Bot {
  id: string;
  name: string;
  emoji: string;
  elo: number;
  depth: number;
  randomness: number;
  preferAttack: boolean;
  description: string;
  playstyle: string;
  difficulty: 'Easy' | 'Normal' | 'Expert';
}

export const BOTS: Bot[] = [
  {
    id: 'easy',
    name: 'EASY',
    emoji: '🟢',
    elo: 0,
    depth: 1,
    randomness: 0.5,
    preferAttack: false,
    description: 'Perfect for beginners. Makes occasional mistakes.',
    playstyle: 'Casual',
    difficulty: 'Easy',
  },
  {
    id: 'normal',
    name: 'NORMAL',
    emoji: '🟡',
    elo: 0,
    depth: 2,
    randomness: 0.2,
    preferAttack: true,
    description: 'A solid challenge. Plays standard chess tactics.',
    playstyle: 'Balanced',
    difficulty: 'Normal',
  },
  {
    id: 'expert',
    name: 'EXPERT',
    emoji: '🔴',
    elo: 0,
    depth: 2,
    randomness: 0.0,
    preferAttack: true,
    description: 'The ultimate challenge. Fast and efficient moves.',
    playstyle: 'Grandmaster',
    difficulty: 'Expert',
  },
];
