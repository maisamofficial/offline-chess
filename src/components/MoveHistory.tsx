// Move History Panel

import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  moves: string[];
  currentIndex: number;
  onSelectMove: (index: number) => void;
}

export default function MoveHistory({ moves, currentIndex, onSelectMove }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [moves.length]);

  const pairs: [string, string?][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Move History</Text>
      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
        {pairs.map((pair, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.num}>{idx + 1}.</Text>
            <TouchableOpacity
              style={[styles.moveBtn, currentIndex === idx * 2 && styles.active]}
              onPress={() => onSelectMove(idx * 2)}
            >
              <Text style={[styles.move, currentIndex === idx * 2 && styles.activeTxt]}>
                {pair[0]}
              </Text>
            </TouchableOpacity>
            {pair[1] && (
              <TouchableOpacity
                style={[styles.moveBtn, currentIndex === idx * 2 + 1 && styles.active]}
                onPress={() => onSelectMove(idx * 2 + 1)}
              >
                <Text style={[styles.move, currentIndex === idx * 2 + 1 && styles.activeTxt]}>
                  {pair[1]}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {moves.length === 0 && (
          <Text style={styles.empty}>No moves yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, maxHeight: 140 },
  title: { color: '#aaa', fontSize: 11, marginBottom: 6, fontWeight: '600', letterSpacing: 1 },
  scroll: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  num: { color: '#666', fontSize: 12, width: 28 },
  moveBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 4 },
  active: { backgroundColor: '#6c63ff' },
  move: { color: '#ccc', fontSize: 13, fontFamily: 'monospace' },
  activeTxt: { color: '#fff', fontWeight: '600' },
  empty: { color: '#555', fontSize: 12, textAlign: 'center', padding: 10 },
});
