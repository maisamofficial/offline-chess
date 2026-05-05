// Bot Selection Screen

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { BOTS, Bot } from '../engine/bots';
import { loadStats, AllStats, saveLastBot } from '../utils/storage';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'BotSelect'> };

const DIFF_COLORS: Record<string, string> = {
  Easy: '#4CAF50', Normal: '#FFC107', Expert: '#F44336',
};

export default function BotSelectScreen({ navigation }: Props) {
  const [stats, setStats] = useState<AllStats>({});

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const selectBot = async (bot: Bot) => {
    await saveLastBot(bot.id);
    navigation.navigate('Game', { botId: bot.id, mode: 'bot' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Difficulty</Text>
          <Text style={styles.subtitle}>Select your challenge</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.listContent}>
        {BOTS.map((bot) => {
          const color = DIFF_COLORS[bot.difficulty];
          
          return (
            <TouchableOpacity 
              key={bot.id}
              activeOpacity={0.8} 
              style={[styles.card, { borderLeftColor: color }]} 
              onPress={() => selectBot(bot)}
            >
              <View style={styles.cardMain}>
                <View style={[styles.emojiContainer, { backgroundColor: color + '15' }]}>
                  <Text style={[styles.emoji, { color }]}>{bot.emoji}</Text>
                </View>
                
                <View style={styles.info}>
                  <Text style={[styles.name, { color }]}>{bot.name}</Text>
                  <Text style={styles.description}>{bot.description}</Text>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.playstyle}>{bot.playstyle} AI</Text>
                  </View>
                </View>
                
                <Text style={[styles.arrow, { color: color + '44' }]}>→</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.footerTxt}>Instant AI Response · 100% Offline</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#111',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#222',
  },
  backTxt: { color: '#fff', fontSize: 20, fontWeight: '600' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 2 },
  listContent: { padding: 20, gap: 20, flex: 1 },
  card: { 
    backgroundColor: '#111', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: '#222', borderLeftWidth: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 5,
  },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  emojiContainer: { 
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  description: { color: '#888', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statVal: { color: '#666', fontSize: 11, fontWeight: '700' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#333' },
  playstyle: { color: '#555', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  arrow: { fontSize: 24, fontWeight: '300', marginLeft: 8 },
  footerInfo: { padding: 40, alignItems: 'center' },
  footerTxt: { color: '#222', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
});
