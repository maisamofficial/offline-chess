// Full Chess Engine - Legal Move Generation & Game State

export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type Color = 'w' | 'b';
export type Square = string; // e.g. "e4"

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Move {
  from: Square;
  to: Square;
  promotion?: PieceType;
  flags: string; // n=normal, c=capture, e=enpassant, k=kingside, q=queenside, p=promotion
}

export interface GameState {
  board: (Piece | null)[][];
  turn: Color;
  castling: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  enPassant: Square | null;
  halfMoves: number;
  fullMoves: number;
  history: Move[];
  capturedByWhite: Piece[];
  capturedByBlack: Piece[];
}

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['1','2','3','4','5','6','7','8'];

export function squareToCoords(sq: Square): [number, number] {
  return [FILES.indexOf(sq[0]), RANKS.indexOf(sq[1])];
}

export function coordsToSquare(file: number, rank: number): Square {
  return FILES[file] + RANKS[rank];
}

export function initialState(): GameState {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  const backRank: PieceType[] = ['R','N','B','Q','K','B','N','R'];
  for (let f = 0; f < 8; f++) {
    board[f][0] = { type: backRank[f], color: 'w' };
    board[f][1] = { type: 'P', color: 'w' };
    board[f][6] = { type: 'P', color: 'b' };
    board[f][7] = { type: backRank[f], color: 'b' };
  }
  return {
    board,
    turn: 'w',
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    enPassant: null,
    halfMoves: 0,
    fullMoves: 1,
    history: [],
    capturedByWhite: [],
    capturedByBlack: [],
  };
}

export function getPiece(state: GameState, sq: Square): Piece | null {
  const [f, r] = squareToCoords(sq);
  return state.board[f][r];
}

function inBounds(f: number, r: number): boolean {
  return f >= 0 && f < 8 && r >= 0 && r < 8;
}

function isEnemy(piece: Piece | null, color: Color): boolean {
  return piece !== null && piece.color !== color;
}

function isEmpty(board: (Piece | null)[][], f: number, r: number): boolean {
  return board[f][r] === null;
}

// Generate pseudo-legal moves (ignoring check)
function pseudoLegalMoves(state: GameState, sq: Square, onlyAttacks = false): Move[] {
  const [f, r] = squareToCoords(sq);
  const piece = state.board[f][r];
  if (!piece) return [];
  if (!onlyAttacks && piece.color !== state.turn) return [];

  const moves: Move[] = [];
  const { board, enPassant, castling } = state;
  const color = piece.color;

  const addMove = (tf: number, tr: number, flags = 'n', promotion?: PieceType) => {
    if (!inBounds(tf, tr)) return;
    const target = board[tf][tr];
    if (target && target.color === color) {
      if (onlyAttacks) {
        // Still counts as an attack (defending a piece)
        moves.push({ from: sq, to: coordsToSquare(tf, tr), flags: 'n' });
      }
      return;
    }
    const toSq = coordsToSquare(tf, tr);
    if (promotion) {
      moves.push({ from: sq, to: toSq, flags: flags + 'p', promotion });
    } else {
      moves.push({ from: sq, to: toSq, flags: target ? 'c' : flags });
    }
  };

  const slide = (dfs: number[], drs: number[]) => {
    for (let i = 0; i < dfs.length; i++) {
      let nf = f + dfs[i], nr = r + drs[i];
      while (inBounds(nf, nr)) {
        if (board[nf][nr]) {
          addMove(nf, nr, 'c');
          break;
        }
        addMove(nf, nr);
        nf += dfs[i]; nr += drs[i];
      }
    }
  };

  switch (piece.type) {
    case 'P': {
      const dir = color === 'w' ? 1 : -1;
      const startRank = color === 'w' ? 1 : 6;
      const promRank = color === 'w' ? 7 : 0;
      
      // Forward (not an attack)
      if (!onlyAttacks) {
        if (inBounds(f, r + dir) && isEmpty(board, f, r + dir)) {
          if (r + dir === promRank) {
            (['Q','R','B','N'] as PieceType[]).forEach(p => addMove(f, r + dir, 'p', p));
          } else {
            addMove(f, r + dir);
            if (r === startRank && isEmpty(board, f, r + 2 * dir)) addMove(f, r + 2 * dir, 'b');
          }
        }
      }
      
      // Captures (attacks)
      [-1, 1].forEach(df => {
        const nf = f + df, nr = r + dir;
        if (!inBounds(nf, nr)) return;
        if (board[nf][nr]) {
          if (board[nf][nr]!.color !== color) {
            if (nr === promRank) {
              (['Q','R','B','N'] as PieceType[]).forEach(p => addMove(nf, nr, 'cp', p));
            } else {
              addMove(nf, nr, 'c');
            }
          } else if (onlyAttacks) {
            addMove(nf, nr); // Defending own piece
          }
        } else {
          if (onlyAttacks) {
            addMove(nf, nr); // Attacking empty square
          }
          // En passant
          if (!onlyAttacks && enPassant && coordsToSquare(nf, nr) === enPassant) {
            moves.push({ from: sq, to: enPassant, flags: 'e' });
          }
        }
      });
      break;
    }
    case 'N':
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([df,dr]) => addMove(f+df, r+dr));
      break;
    case 'B':
      slide([1,1,-1,-1],[1,-1,1,-1]);
      break;
    case 'R':
      slide([1,-1,0,0],[0,0,1,-1]);
      break;
    case 'Q':
      slide([1,-1,0,0,1,1,-1,-1],[0,0,1,-1,1,-1,1,-1]);
      break;
    case 'K': {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([df,dr]) => addMove(f+df, r+dr));
      // Castling (not an attack)
      if (!onlyAttacks) {
        if (color === 'w' && r === 0 && f === 4) {
          if (castling.wK && isEmpty(board,5,0) && isEmpty(board,6,0))
            moves.push({ from: sq, to: 'g1', flags: 'k' });
          if (castling.wQ && isEmpty(board,3,0) && isEmpty(board,2,0) && isEmpty(board,1,0))
            moves.push({ from: sq, to: 'c1', flags: 'q' });
        }
        if (color === 'b' && r === 7 && f === 4) {
          if (castling.bK && isEmpty(board,5,7) && isEmpty(board,6,7))
            moves.push({ from: sq, to: 'g8', flags: 'k' });
          if (castling.bQ && isEmpty(board,3,7) && isEmpty(board,2,7) && isEmpty(board,1,7))
            moves.push({ from: sq, to: 'c8', flags: 'q' });
        }
      }
      break;
    }
  }
  return moves;
}

export function isSquareAttacked(state: GameState, sq: Square, byColor: Color): boolean {
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      const piece = state.board[f][r];
      if (piece && piece.color === byColor) {
        const from = coordsToSquare(f, r);
        const moves = pseudoLegalMoves(state, from, true);
        if (moves.some(m => m.to === sq)) return true;
      }
    }
  }
  return false;
}

function findKing(state: GameState, color: Color): Square | null {
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      const p = state.board[f][r];
      if (p && p.type === 'K' && p.color === color) return coordsToSquare(f, r);
    }
  }
  return null;
}

export function applyMove(state: GameState, move: Move): GameState {
  const newBoard = state.board.map(col => [...col]);
  const [ff, fr] = squareToCoords(move.from);
  const [tf, tr] = squareToCoords(move.to);
  const piece = newBoard[ff][fr]!;
  const captured = newBoard[tf][tr];

  const newCapturedByWhite = [...state.capturedByWhite];
  const newCapturedByBlack = [...state.capturedByBlack];

  if (captured) {
    if (piece.color === 'w') newCapturedByWhite.push(captured);
    else newCapturedByBlack.push(captured);
  }

  newBoard[tf][tr] = move.promotion ? { type: move.promotion, color: piece.color } : piece;
  newBoard[ff][fr] = null;

  // En passant capture
  if (move.flags === 'e') {
    const epRank = piece.color === 'w' ? tr - 1 : tr + 1;
    const epPiece = newBoard[tf][epRank];
    if (epPiece) {
      if (piece.color === 'w') newCapturedByWhite.push(epPiece);
      else newCapturedByBlack.push(epPiece);
    }
    newBoard[tf][epRank] = null;
  }

  // Castling rook move
  if (move.flags === 'k') {
    if (piece.color === 'w') { newBoard[5][0] = newBoard[7][0]; newBoard[7][0] = null; }
    else { newBoard[5][7] = newBoard[7][7]; newBoard[7][7] = null; }
  }
  if (move.flags === 'q') {
    if (piece.color === 'w') { newBoard[3][0] = newBoard[0][0]; newBoard[0][0] = null; }
    else { newBoard[3][7] = newBoard[0][7]; newBoard[0][7] = null; }
  }

  // Update castling rights
  const newCastling = { ...state.castling };
  if (piece.type === 'K') {
    if (piece.color === 'w') { newCastling.wK = false; newCastling.wQ = false; }
    else { newCastling.bK = false; newCastling.bQ = false; }
  }
  if (move.from === 'a1' || move.to === 'a1') newCastling.wQ = false;
  if (move.from === 'h1' || move.to === 'h1') newCastling.wK = false;
  if (move.from === 'a8' || move.to === 'a8') newCastling.bQ = false;
  if (move.from === 'h8' || move.to === 'h8') newCastling.bK = false;

  // En passant square
  let newEnPassant: Square | null = null;
  if (piece.type === 'P' && Math.abs(tr - fr) === 2) {
    newEnPassant = coordsToSquare(tf, (fr + tr) / 2);
  }

  return {
    board: newBoard,
    turn: state.turn === 'w' ? 'b' : 'w',
    castling: newCastling,
    enPassant: newEnPassant,
    halfMoves: (piece.type === 'P' || captured) ? 0 : state.halfMoves + 1,
    fullMoves: state.turn === 'b' ? state.fullMoves + 1 : state.fullMoves,
    history: [...state.history, move],
    capturedByWhite: newCapturedByWhite,
    capturedByBlack: newCapturedByBlack,
  };
}

export function legalMoves(state: GameState, sq: Square): Move[] {
  const pseudo = pseudoLegalMoves(state, sq);
  return pseudo.filter(move => {
    const next = applyMove(state, move);
    const kingSquare = findKing(next, state.turn);
    if (!kingSquare) return false;
    // Check castling doesn't pass through check
    if (move.flags === 'k' || move.flags === 'q') {
      const passingSquare = move.flags === 'k'
        ? coordsToSquare(5, state.turn === 'w' ? 0 : 7)
        : coordsToSquare(3, state.turn === 'w' ? 0 : 7);
      if (isSquareAttacked(state, passingSquare, state.turn === 'w' ? 'b' : 'w')) return false;
      if (isSquareAttacked(state, move.from, state.turn === 'w' ? 'b' : 'w')) return false;
    }
    return !isSquareAttacked(next, kingSquare, next.turn);
  });
}

export function allLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      const piece = state.board[f][r];
      if (piece && piece.color === state.turn) {
        moves.push(...legalMoves(state, coordsToSquare(f, r)));
      }
    }
  }
  return moves;
}

export function isInCheck(state: GameState): boolean {
  const kingSquare = findKing(state, state.turn);
  if (!kingSquare) return false;
  return isSquareAttacked(state, kingSquare, state.turn === 'w' ? 'b' : 'w');
}

export type GameResult = 'checkmate' | 'stalemate' | 'draw50' | 'ongoing';

export function getGameResult(state: GameState): GameResult {
  if (state.halfMoves >= 100) return 'draw50';
  const moves = allLegalMoves(state);
  if (moves.length === 0) {
    return isInCheck(state) ? 'checkmate' : 'stalemate';
  }
  return 'ongoing';
}

export function moveToNotation(state: GameState, move: Move): string {
  const piece = getPiece(state, move.from);
  if (!piece) return '';
  const capture = move.flags.includes('c') || move.flags === 'e' ? 'x' : '';
  const promo = move.promotion ? '=' + move.promotion : '';
  if (piece.type === 'K' && move.flags === 'k') return 'O-O';
  if (piece.type === 'K' && move.flags === 'q') return 'O-O-O';
  const prefix = piece.type === 'P' ? (capture ? move.from[0] : '') : piece.type;
  const next = applyMove(state, move);
  const check = isInCheck(next) ? (allLegalMoves(next).length === 0 ? '#' : '+') : '';
  return prefix + capture + move.to + promo + check;
}
