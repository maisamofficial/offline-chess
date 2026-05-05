// AsyncStorage Utilities

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, Settings } from '../constants/themes';

const KEYS = {
  SETTINGS: 'chess_settings',
  STATS: 'chess_stats',
  LAST_BOT: 'chess_last_bot',
};

export interface BotStats {
  wins: number;
  losses: number;
  draws: number;
}

export type AllStats = Record<string, BotStats>;

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

export async function loadStats(): Promise<AllStats> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STATS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveStats(stats: AllStats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  } catch {}
}

export async function recordResult(botId: string, result: 'win' | 'loss' | 'draw'): Promise<void> {
  const stats = await loadStats();
  if (!stats[botId]) stats[botId] = { wins: 0, losses: 0, draws: 0 };
  if (result === 'win') stats[botId].wins++;
  else if (result === 'loss') stats[botId].losses++;
  else stats[botId].draws++;
  await saveStats(stats);
}

export async function loadLastBot(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(KEYS.LAST_BOT)) || 'baby';
  } catch {
    return 'baby';
  }
}

export async function saveLastBot(botId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_BOT, botId);
  } catch {}
}
