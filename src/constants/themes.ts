// App Constants - Themes, Time Controls, Settings

export const BOARD_THEMES = {
  Classic: { light: '#F0D9B5', dark: '#B58863', highlight: '#F6F669', selected: '#7FC97F' },
  Dark:    { light: '#3d3d3d', dark: '#1a1a1a', highlight: '#b8860b', selected: '#4a7c59' },
  Forest:  { light: '#ADED96', dark: '#6D8B4E', highlight: '#F0E68C', selected: '#90EE90' },
  Ocean:   { light: '#B0D4F1', dark: '#4682B4', highlight: '#FFD700', selected: '#40E0D0' },
  Desert:  { light: '#F4D03F', dark: '#CA6F1E', highlight: '#ABEBC6', selected: '#E59866' },
};

export const TIME_CONTROLS = [
  { label: '1 min', seconds: 60, name: 'Bullet' },
  { label: '3 min', seconds: 180, name: 'Blitz' },
  { label: '5 min', seconds: 300, name: 'Blitz' },
  { label: '10 min', seconds: 600, name: 'Rapid' },
  { label: '30 min', seconds: 1800, name: 'Classical' },
  { label: 'Unlimited', seconds: 0, name: 'Unlimited' },
];

export const PIECE_SYMBOLS: Record<string, Record<string, string>> = {
  w: { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' },
  b: { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' },
};

export const DEFAULT_SETTINGS = {
  boardTheme: 'Classic' as keyof typeof BOARD_THEMES,
  showCoordinates: true,
  showLegalMoves: true,
  animationSpeed: 'Normal' as 'Off' | 'Fast' | 'Normal' | 'Slow',
  soundEnabled: true,
  hintLimit: 3,
  undoLimit: 3,
  autoQueenPromotion: true,
  confirmResign: true,
  timeControl: 2, // index into TIME_CONTROLS
};

export type Settings = typeof DEFAULT_SETTINGS;
