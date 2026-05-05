// Captured Pieces Display

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Piece } from '../engine/chess';
import { PIECE_SYMBOLS } from '../constants/themes';

interface Props {
  captured: Piece[];
  advantage: number;
  label: string;
}

export default function CapturedPieces({ captured, advantage, label }: Props) {
  const order = ['Q','R','B','N','P'];
  const sorted = [...captured].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}: </Text>
      <View style={styles.pieces}>
        {sorted.map((p, i) => (
          <Text key={i} style={styles.piece}>{PIECE_SYMBOLS[p.color][p.type]}</Text>
        ))}
      </View>
      {advantage > 0 && <Text style={styles.advantage}>+{advantage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 24 },
  label: { color: '#888', fontSize: 11 },
  pieces: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  piece: { fontSize: 16 },
  advantage: { color: '#6c63ff', fontSize: 13, fontWeight: '700', marginLeft: 4 },
});
