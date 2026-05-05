// Chess Timer Component

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  seconds: number;
  active: boolean;
  onFlag: () => void;
  unlimited: boolean;
}

export default function Timer({ seconds, active, onFlag, unlimited }: Props) {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (unlimited) return;
    if (active && seconds > 0) {
      ref.current = setInterval(onFlag, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [active, seconds, unlimited]);

  if (unlimited) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs.toString().padStart(2,'0')}`;
  const isLow = seconds <= 10;

  return (
    <View style={[styles.box, active && styles.active, isLow && styles.danger]}>
      <Text style={[styles.text, isLow && styles.dangerText]}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#2a2a2a',
    borderWidth: 1, borderColor: '#333',
  },
  active: { borderColor: '#6c63ff', backgroundColor: '#1a1a2e' },
  danger: { borderColor: '#e24b4a', backgroundColor: '#2d1a1a' },
  text: { color: '#fff', fontSize: 22, fontWeight: '700', fontFamily: 'monospace' },
  dangerText: { color: '#e24b4a' },
});
