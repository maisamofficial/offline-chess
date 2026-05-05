// Settings Screen

import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, StatusBar
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { loadSettings, saveSettings } from '../utils/storage';
import { Settings, BOARD_THEMES, TIME_CONTROLS } from '../constants/themes';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'> };

export default function SettingsScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => { loadSettings().then(setSettings); }, []);

  const update = async (key: keyof Settings, value: any) => {
    if (!settings) return;
    const next = { ...settings, [key]: value };
    setSettings(next);
    await saveSettings(next);
  };

  if (!settings) return <View style={styles.container} />;

  const Section = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>{children}</View>
    </View>
  );

  const Chips = ({ options, value, onSelect }: { options: any[]; value: any; onSelect: (v: any) => void }) => (
    <View style={styles.chips}>
      {options.map(o => (
        <TouchableOpacity
          key={String(o)}
          style={[styles.chip, value === o && styles.chipActive]}
          onPress={() => onSelect(o)}
        >
          <Text style={[styles.chipTxt, value === o && styles.chipTxtActive]}>{String(o)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Section title="BOARD APPEARANCE" />
        <View style={styles.card}>
          <Row label="Theme">
            <Chips
              options={Object.keys(BOARD_THEMES)}
              value={settings.boardTheme}
              onSelect={v => update('boardTheme', v)}
            />
          </Row>
          <Row label="Show Coordinates">
            <Switch
              value={settings.showCoordinates}
              onValueChange={v => update('showCoordinates', v)}
              trackColor={{ true: '#6c63ff', false: '#333' }}
              thumbColor="#fff"
            />
          </Row>
          <Row label="Show Legal Moves">
            <Switch
              value={settings.showLegalMoves}
              onValueChange={v => update('showLegalMoves', v)}
              trackColor={{ true: '#6c63ff', false: '#333' }}
              thumbColor="#fff"
            />
          </Row>
          <Row label="Auto Queen Promotion">
            <Switch
              value={settings.autoQueenPromotion}
              onValueChange={v => update('autoQueenPromotion', v)}
              trackColor={{ true: '#6c63ff', false: '#333' }}
              thumbColor="#fff"
            />
          </Row>
        </View>

        <Section title="GAMEPLAY RULES" />
        <View style={styles.card}>
          <Row label="Time Control">
            <Chips
              options={TIME_CONTROLS.map((_, i) => i)}
              value={settings.timeControl}
              onSelect={v => update('timeControl', v)}
              labels={TIME_CONTROLS.map(tc => tc.name)}
            />
          </Row>
          <Row label="Undo Limit">
            <Chips
              options={[1, 3, 5, -1]}
              value={settings.undoLimit}
              onSelect={v => update('undoLimit', v)}
              labels={['1', '3', '5', '∞']}
            />
          </Row>
          <Row label="Confirm Resign">
            <Switch
              value={settings.confirmResign}
              onValueChange={v => update('confirmResign', v)}
              trackColor={{ true: '#6c63ff', false: '#333' }}
              thumbColor="#fff"
            />
          </Row>
        </View>

        <Section title="AUDIO & EFFECTS" />
        <View style={styles.card}>
          <Row label="Sound Effects">
            <Switch
              value={settings.soundEnabled}
              onValueChange={v => update('soundEnabled', v)}
              trackColor={{ true: '#6c63ff', false: '#333' }}
              thumbColor="#fff"
            />
          </Row>
          <Row label="Animation Speed">
            <Chips
              options={['Off', 'Fast', 'Normal', 'Slow']}
              value={settings.animationSpeed}
              onSelect={v => update('animationSpeed', v)}
            />
          </Row>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>♟</Text>
          </View>
          <Text style={styles.infoTitle}>Offline Chess</Text>
          <Text style={styles.infoAuthor}>By Maisam Abbas</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>V 0.1.1</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.footerText}>Handcrafted with passion for the chess community.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333',
  },
  backTxt: { color: '#fff', fontSize: 20, fontWeight: '600' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  sectionTitle: {
    color: '#6c63ff', fontSize: 11, fontWeight: '800',
    letterSpacing: 2, marginTop: 24, marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#111', borderRadius: 20,
    borderWidth: 1, borderColor: '#222', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  rowLabel: { color: '#eee', fontSize: 15, fontWeight: '500', flex: 1 },
  rowRight: { flex: 1, alignItems: 'flex-end' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: '#333', backgroundColor: '#1a1a1a',
  },
  chipActive: { backgroundColor: '#6c63ff', borderColor: '#6c63ff' },
  chipTxt: { color: '#777', fontSize: 12, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },
  
  infoCard: {
    marginTop: 40, backgroundColor: '#111', borderRadius: 24, padding: 30,
    alignItems: 'center', borderWidth: 1, borderColor: '#222',
    borderStyle: 'dashed',
  },
  infoIconContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#333',
  },
  infoIcon: { fontSize: 30, color: '#6c63ff' },
  infoTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  infoAuthor: { color: '#6c63ff', fontSize: 14, fontWeight: '600', marginTop: 4 },
  versionBadge: {
    marginTop: 12, backgroundColor: '#1a1a1a', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#333',
  },
  versionText: { color: '#888', fontSize: 11, fontWeight: '700' },
  divider: { width: 40, height: 2, backgroundColor: '#222', marginVertical: 20, borderRadius: 1 },
  footerText: { color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
