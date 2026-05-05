// How To Play Screen

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'HowToPlay'> };

const sections = [
  {
    icon: '♟', title: 'Pieces & Movement',
    content: [
      '♔ King — moves one square in any direction. Protect at all costs.',
      '♕ Queen — moves any number of squares in any direction. Most powerful piece.',
      '♖ Rook — moves any number of squares horizontally or vertically.',
      '♗ Bishop — moves any number of squares diagonally.',
      '♘ Knight — moves in an L-shape: 2 squares in one direction, 1 in another. Can jump over pieces.',
      '♙ Pawn — moves forward one square (or two from starting position). Captures diagonally.',
    ]
  },
  {
    icon: '⚡', title: 'Special Moves',
    content: [
      'Castling — King moves 2 squares toward a Rook, and the Rook jumps to the other side. Neither piece must have moved before.',
      'En Passant — If a pawn moves two squares forward and lands beside an enemy pawn, the enemy pawn can capture it as if it only moved one square.',
      'Promotion — When a pawn reaches the last rank, it promotes to a Queen, Rook, Bishop or Knight.',
    ]
  },
  {
    icon: '🏆', title: 'Check, Checkmate & Stalemate',
    content: [
      'Check — Your king is under attack. You must escape check immediately.',
      'Checkmate — Your king is in check and there is no legal move to escape. Game over — you lose.',
      'Stalemate — You have no legal moves but are not in check. The game is a draw.',
    ]
  },
  {
    icon: '💡', title: 'Hints',
    content: [
      'Tap the Hint button during your turn to see the best move highlighted on the board.',
      'You have a limited number of hints per game (configurable in Settings).',
      'The hint counter shows how many hints you have left.',
    ]
  },
  {
    icon: '↩', title: 'Undo',
    content: [
      'Tap Undo to take back your last move and the bot\'s response.',
      'You have a limited number of undos per game (configurable in Settings).',
      'Undo is not available if you are reviewing move history.',
    ]
  },
  {
    icon: '⏱', title: 'Time Controls',
    content: [
      'Bullet (1 min) — Ultra fast. Both players have 1 minute total.',
      'Blitz (3 or 5 min) — Fast paced. Popular for casual games.',
      'Rapid (10 min) — Balanced. Time to think but not too slow.',
      'Classical (30 min) — Full games with deep thinking.',
      'Unlimited — No timer. Play at your own pace.',
    ]
  },
];

export default function HowToPlayScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Tutorial</Text>
          <Text style={styles.subtitle}>Learn the Grandmaster way</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {sections.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardIcon}>{s.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{s.title}</Text>
            </View>
            <View style={styles.content}>
              {s.content.map((line, j) => (
                <View key={j} style={styles.lineRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.line}>{line}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerTxt}>Ready to test your skills?</Text>
          <TouchableOpacity 
            style={styles.playBtn}
            onPress={() => navigation.navigate('BotSelect')}
          >
            <Text style={styles.playBtnTxt}>PLAY NOW</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#111',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#222',
  },
  backTxt: { color: '#fff', fontSize: 20, fontWeight: '600' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 2 },
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  card: {
    backgroundColor: '#111', borderRadius: 24,
    padding: 20, borderWidth: 1, borderColor: '#222',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  iconContainer: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333',
  },
  cardIcon: { fontSize: 24 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  content: { gap: 12 },
  lineRow: { flexDirection: 'row', gap: 12 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6c63ff', marginTop: 9 },
  line: { color: '#aaa', fontSize: 14, lineHeight: 22, flex: 1 },
  footer: { marginTop: 40, alignItems: 'center', gap: 20 },
  footerTxt: { color: '#444', fontSize: 14, fontWeight: '600' },
  playBtn: {
    backgroundColor: '#6c63ff', paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 20, shadowColor: '#6c63ff', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  playBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});
