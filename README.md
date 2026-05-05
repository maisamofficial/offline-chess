# Chess Offline ♟

A fully offline chess app built with React Native Expo. Play against 12 AI bots with no internet required.

## Features
- 12 AI bots from ELO 200 to ELO 2500
- Full chess rules — castling, en passant, promotion
- Hint system with configurable limit
- Undo system with configurable limit
- Move history in algebraic notation
- Multiple time controls — Bullet to Classical
- 5 board themes
- Captured pieces display with material advantage
- Win/loss/draw stats per bot
- 100% offline — no internet, no login, no ads

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start the app
```bash
npx expo start
```

### 3. Run on device
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

## Project Structure
```
App.tsx                        # Entry point + navigation
src/
  engine/
    chess.ts                   # Full chess rules & legal moves
    evaluation.ts              # Position evaluation
    minimax.ts                 # Minimax with alpha-beta pruning
    bots.ts                    # All 12 bot definitions
  screens/
    HomeScreen.tsx
    BotSelectScreen.tsx
    GameScreen.tsx
    ResultScreen.tsx
    SettingsScreen.tsx
    HowToPlayScreen.tsx
  components/
    ChessBoard.tsx             # Interactive board
    MoveHistory.tsx            # Move history panel
    CapturedPieces.tsx         # Captured pieces display
    Timer.tsx                  # Chess clock
  constants/
    themes.ts                  # Board themes, time controls, settings
  utils/
    storage.ts                 # AsyncStorage helpers
```

## Bots
| Bot | ELO | Difficulty |
|-----|-----|------------|
| 🍼 Baby Bot | 200 | Beginner |
| 🦀 Rusty Rook | 400 | Beginner |
| ♟ Pawn Pusher | 600 | Easy |
| 🐴 Knight Rider | 800 | Easy |
| ⛪ Bishop Storm | 1000 | Medium |
| 🏰 Castle King | 1200 | Medium |
| ⚡ Tactical Tony | 1400 | Medium |
| ♞ Positional Pete | 1600 | Hard |
| 🎯 Endgame Edgar | 1800 | Hard |
| 👑 The Grandmaster | 2200 | Expert |
| 🌑 Shadow Bot | 2500 | Master |
| 🎲 Chaos Agent | 999 | Easy |
