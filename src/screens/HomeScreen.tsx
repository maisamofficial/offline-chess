// Home Screen

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { loadSettings } from '../utils/storage';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.hero}>
        <View style={styles.glow} />
        
        {/* Premium Integrated Branding Card */}
        <View style={styles.brandingCard}>
          <View style={styles.brandingHeader}>
            <View style={styles.brandingIconContainer}>
              <Text style={styles.brandingIcon}>♟</Text>
            </View>
            <View>
              <Text style={styles.brandingTitle}>OFFLINE CHESS</Text>
              <Text style={styles.brandingAuthor}>BY MAISAM ABBAS</Text>
            </View>
          </View>
          
          <View style={styles.versionBadgeRow}>
            <View style={styles.versionBadge}>
              <Text style={styles.versionTxt}>VERSION 0.1.1</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusTxt}>OFFLINE READY</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.tagline}>THE MOST BEAUTIFUL CHESS EXPERIENCE ON MOBILE</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.buttons}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.primary} 
            onPress={() => navigation.navigate('BotSelect')}
          >
            <View style={styles.btnContent}>
              <Text style={styles.primaryTxt}>PLAY COMPUTER</Text>
              <Text style={styles.primarySub}>EASY · NORMAL · EXPERT</Text>
            </View>
            <View style={styles.btnArrow}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.primary, { backgroundColor: '#6c63ff' }]} 
            onPress={() => navigation.navigate('Game', { mode: 'local' })}
          >
            <View style={styles.btnContent}>
              <Text style={[styles.primaryTxt, { color: '#fff' }]}>LOCAL MULTIPLAYER</Text>
              <Text style={[styles.primarySub, { color: '#ffffff88' }]}>TWO PLAYERS · SAME DEVICE</Text>
            </View>
            <View style={[styles.btnArrow, { backgroundColor: '#fff' }]}>
              <Text style={[styles.arrowIcon, { color: '#6c63ff' }]}>→</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.secondary} 
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.secondaryIcon}>⚙</Text>
              <Text style={styles.secondaryTxt}>SETTINGS</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.secondary} 
              onPress={() => navigation.navigate('HowToPlay')}
            >
              <Text style={styles.secondaryIcon}>📖</Text>
              <Text style={styles.secondaryTxt}>TUTORIAL</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerTxt}>OFFLINE CHESS BY MAISAM ABBAS</Text>
          <View style={styles.footerLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hero: { flex: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  glow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#6c63ff', opacity: 0.05,
  },
  
  // Premium Branding Card Styles
  brandingCard: {
    backgroundColor: '#111', borderRadius: 32, padding: 24,
    width: '100%', maxWidth: 360, alignSelf: 'center',
    borderWidth: 1, borderColor: '#222',
    shadowColor: '#6c63ff', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15, shadowRadius: 40, elevation: 20,
  },
  brandingHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  brandingIconContainer: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333',
  },
  brandingIcon: { fontSize: 32, color: '#fff' },
  brandingTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  brandingAuthor: { fontSize: 11, fontWeight: '800', color: '#6c63ff', letterSpacing: 2, marginTop: 2 },
  
  versionBadgeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  versionBadge: {
    backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: '#333',
  },
  versionTxt: { color: '#888', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statusBadge: {
    backgroundColor: '#6c63ff15', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: '#6c63ff33',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6c63ff' },
  statusTxt: { color: '#6c63ff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  divider: { height: 1, backgroundColor: '#222', width: '100%', marginBottom: 20 },
  tagline: { color: '#444', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase' },
  
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'flex-end', paddingBottom: 40 },
  buttons: { gap: 16 },
  primary: { 
    backgroundColor: '#fff', borderRadius: 28, padding: 24, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#fff', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 15,
  },
  btnContent: { gap: 2 },
  primaryTxt: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  primarySub: { color: '#888', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  btnArrow: { 
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
  },
  arrowIcon: { color: '#fff', fontSize: 20, fontWeight: '700' },
  
  secondaryRow: { flexDirection: 'row', gap: 16 },
  secondary: { 
    flex: 1, backgroundColor: '#111', borderRadius: 24, padding: 20, 
    alignItems: 'center', borderWidth: 1, borderColor: '#222', gap: 8,
  },
  secondaryIcon: { fontSize: 18, color: '#6c63ff' },
  secondaryTxt: { color: '#aaa', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  
  footerContainer: { marginTop: 40, alignItems: 'center', gap: 12 },
  footerTxt: { color: '#222', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  footerLine: { width: 30, height: 2, backgroundColor: '#111', borderRadius: 1 },
});
