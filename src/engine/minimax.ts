// Minimax with Alpha-Beta Pruning

import { GameState, Move, Color, allLegalMoves, applyMove, getGameResult } from './chess';
import { evaluate } from './evaluation';

export function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  perspective: Color
): number {
  const result = getGameResult(state);
  if (result === 'checkmate') return maximizing ? -100000 : 100000;
  if (result === 'stalemate' || result === 'draw50') return 0;
  if (depth === 0) return evaluate(state, perspective);

  const moves = allLegalMoves(state);

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const next = applyMove(state, move);
      const evalScore = minimax(next, depth - 1, alpha, beta, false, perspective);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const next = applyMove(state, move);
      const evalScore = minimax(next, depth - 1, alpha, beta, true, perspective);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(
  state: GameState,
  depth: number,
  randomness: number = 0,
  preferAttack: boolean = false
): Move | null {
  const moves = allLegalMoves(state);
  if (moves.length === 0) return null;

  // Add randomness for lower bots
  if (Math.random() < randomness) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove: Move | null = null;
  let bestScore = -Infinity;
  const perspective = state.turn;

  // Simple move ordering: captures first
  const orderedMoves = [...moves].sort((a, b) => {
    const aScore = a.flags.includes('c') ? 10 : 0;
    const bScore = b.flags.includes('c') ? 10 : 0;
    return bScore - aScore;
  });

  for (const move of orderedMoves) {
    const next = applyMove(state, move);
    let score = minimax(next, depth - 1, -Infinity, Infinity, false, perspective);

    // Aggressive bots prefer captures
    if (preferAttack && (move.flags.includes('c') || move.flags.includes('e'))) score += 20;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getHintMove(state: GameState): Move | null {
  // Depth 2 is near-instant and still gives good moves
  return getBestMove(state, 2, 0, false);
}
