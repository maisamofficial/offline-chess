// ChessBoard Component - Full Interactive Board

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GameState, Square, Move, legalMoves, coordsToSquare, squareToCoords } from '../engine/chess';
import { BOARD_THEMES, PIECE_SYMBOLS } from '../constants/themes';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 16, 400);
const CELL_SIZE = BOARD_SIZE / 8;

interface Props {
  state: GameState;
  flipped: boolean;
  onMove: (move: Move) => void;
  hintMove: Move | null;
  lastMove: Move | null;
  theme: keyof typeof BOARD_THEMES;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  disabled: boolean;
  multiplayer?: boolean;
}

export default function ChessBoard({
  state, flipped, onMove, hintMove, lastMove,
  theme, showCoordinates, showLegalMoves, disabled, multiplayer = false
}: Props) {
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const colors = BOARD_THEMES[theme];

  const handlePress = (sq: Square) => {
    if (disabled) return;

    if (selected) {
      const move = validMoves.find(m => m.to === sq);
      if (move) {
        onMove(move);
        setSelected(null);
        setValidMoves([]);
        return;
      }
      if (selected === sq) {
        setSelected(null);
        setValidMoves([]);
        return;
      }
    }

    const piece = state.board[squareToCoords(sq)[0]][squareToCoords(sq)[1]];
    if (piece && piece.color === state.turn) {
      setSelected(sq);
      setValidMoves(showLegalMoves ? legalMoves(state, sq) : []);
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  const renderCell = (file: number, rank: number) => {
    const displayFile = flipped ? 7 - file : file;
    const displayRank = flipped ? rank : 7 - rank;
    const sq = coordsToSquare(displayFile, displayRank);
    const piece = state.board[displayFile][displayRank];
    const isLight = (file + rank) % 2 === 0;
    const isSelected = selected === sq;
    const isValidTarget = validMoves.some(m => m.to === sq);
    const isLastFrom = lastMove?.from === sq;
    const isLastTo = lastMove?.to === sq;

    let bg = isLight ? colors.light : colors.dark;
    if (isSelected) bg = colors.selected;
    else if (isLastFrom || isLastTo) bg = colors.highlight;

    // In multiplayer, the player at the "top" of the screen should have their pieces rotated
    // If flipped=false, White is bottom, Black is top (rank 7,6... at top).
    // If flipped=true, Black is bottom, White is top.
    const shouldRotate = multiplayer && (
      (flipped && piece?.color === 'w') || 
      (!flipped && piece?.color === 'b')
    );

    return (
      <TouchableOpacity
        key={sq}
        style={[styles.cell, { backgroundColor: bg, width: CELL_SIZE, height: CELL_SIZE }]}
        onPress={() => handlePress(sq)}
        activeOpacity={0.8}
      >
        {isValidTarget && !piece && (
          <View style={styles.dotIndicator} />
        )}
        {isValidTarget && piece && (
          <View style={styles.captureRing} />
        )}
        {piece && (
          <Text style={[
            styles.piece, 
            { fontSize: CELL_SIZE * 0.72 },
            shouldRotate && { transform: [{ rotate: '180deg' }] }
          ]}>
            {PIECE_SYMBOLS[piece.color][piece.type]}
          </Text>
        )}
        {showCoordinates && rank === 7 && (
          <Text style={[styles.fileLabel, { color: isLight ? colors.dark : colors.light }]}>
            {['a','b','c','d','e','f','g','h'][displayFile]}
          </Text>
        )}
        {showCoordinates && file === 0 && (
          <Text style={[styles.rankLabel, { color: isLight ? colors.dark : colors.light }]}>
            {displayRank + 1}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {Array(8).fill(null).map((_, rank) =>
        <View key={rank} style={styles.row}>
          {Array(8).fill(null).map((_, file) => renderCell(file, rank))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { borderWidth: 2, borderColor: '#333', alignSelf: 'center' },
  row: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  piece: { textAlign: 'center', lineHeight: undefined },
  dotIndicator: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)', position: 'absolute',
  },
  captureRing: {
    position: 'absolute', width: '90%', height: '90%',
    borderRadius: 4, borderWidth: 4, borderColor: 'rgba(0,0,0,0.25)',
  },
  fileLabel: { position: 'absolute', bottom: 1, right: 2, fontSize: 10, fontWeight: 'bold' },
  rankLabel: { position: 'absolute', top: 1, left: 2, fontSize: 10, fontWeight: 'bold' },
});
