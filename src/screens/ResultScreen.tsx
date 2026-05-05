// Result Screen

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { BOTS } from '../engine/bots';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export default function ResultScreen({ navigation, route }: Props) {
  const { result, message, botId, moves, mode } = route.params;
  const isBot = mode === 'bot';
  const bot = isBot ? (BOTS.find(b => b.id === botId) || BOTS[0]) : null;

  const isWin = result === 'win';
  const isDraw = result === 'draw';

  const emoji = isDraw ? '🤝' : (isBot ? (isWin ? '🏆' : '💀') : '🏆');
  const color = isWin ? '#4CAF50' : isDraw ? '#FFC107' : (isBot ? '#e24b4a' : '#4CAF50');
  const label = isDraw ? 'Draw' : (isBot ? (isWin ? 'Victory!' : 'Defeat') : 'Victory!');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      <View style={styles.hero}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.statKey}>{isBot ? 'Opponent' : 'Mode'}</Text>
          <Text style={styles.statVal}>
            {isBot ? `${bot?.emoji} ${bot?.name} (ELO ${bot?.elo})` : '👥 Local Multiplayer'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statKey}>Total Moves</Text>
          <Text style={styles.statVal}>{moves}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statKey}>Result</Text>
          <Text style={[styles.statVal, { color }]}>{label}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.replace('Game', { botId, mode })}
        >
          <Text style={styles.primaryTxt}>▶  Play Again</Text>
        </TouchableOpacity>
        
        {isBot && (
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => navigation.navigate('BotSelect')}
          >
            <Text style={styles.secondaryTxt}>🤖  Change Bot</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryTxt}>🏠  Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 24, justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 80, marginBottom: 16 },
  label: { fontSize: 40, fontWeight: '800', marginBottom: 8 },
  message: { color: '#aaa', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  stats: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 24, gap: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statKey: { color: '#666', fontSize: 14 },
  statVal: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttons: { gap: 12 },
  primary: { backgroundColor: '#6c63ff', borderRadius: 14, padding: 18, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondary: { backgroundColor: '#1e1e1e', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  secondaryTxt: { color: '#ccc', fontSize: 15 },
});
