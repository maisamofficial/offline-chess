// Main Game Screen

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import ChessBoard from '../components/ChessBoard';
import MoveHistory from '../components/MoveHistory';
import CapturedPieces from '../components/CapturedPieces';
import Timer from '../components/Timer';
import {
  GameState, Move, initialState, applyMove,
  getGameResult, moveToNotation, allLegalMoves, isInCheck
} from '../engine/chess';
import { getBestMove, getHintMove } from '../engine/minimax';
import { getMaterialAdvantage } from '../engine/evaluation';
import { BOTS, Bot } from '../engine/bots';
import { loadSettings, recordResult } from '../utils/storage';
import { Settings, TIME_CONTROLS, BOARD_THEMES } from '../constants/themes';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

export default function GameScreen({ navigation, route }: Props) {
  const { botId, mode } = route.params;
  const isBot = mode === 'bot';
  const bot: Bot | null = isBot ? (BOTS.find(b => b.id === botId) || BOTS[0]) : null;

  const [gameState, setGameState] = useState<GameState>(initialState());
  const [stateHistory, setStateHistory] = useState<GameState[]>([initialState()]);
  const [moveNotations, setMoveNotations] = useState<string[]>([]);
  const [hintMove, setHintMove] = useState<Move | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [undosUsed, setUndosUsed] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [botThinking, setBotThinking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [playerTime, setPlayerTime] = useState(0);
  const [botTime, setBotTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const playerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      const tc = TIME_CONTROLS[s.timeControl];
      setPlayerTime(tc.seconds);
      setBotTime(tc.seconds);
    });
  }, []);

  // Start player timer when it's player's turn
  useEffect(() => {
    if (!settings || gameOver) return;
    const tc = TIME_CONTROLS[settings.timeControl];
    if (tc.seconds === 0) return; // unlimited

    if (gameState.turn === 'w') {
      playerTimerRef.current = setInterval(() => {
        setPlayerTime(t => {
          if (t <= 1) {
            clearInterval(playerTimerRef.current!);
            handleGameOver('timeout_player');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    }

    if (gameState.turn === 'b') {
      botTimerRef.current = setInterval(() => {
        setBotTime(t => {
          if (t <= 1) {
            clearInterval(botTimerRef.current!);
            handleGameOver('timeout_bot');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    }

    return () => {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    };
  }, [gameState.turn, botThinking, gameOver, settings]);

  const handleGameOver = useCallback(async (reason: string) => {
    if (gameOver) return;
    setGameOver(true);
    if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    if (botTimerRef.current) clearInterval(botTimerRef.current);

    let result: 'win' | 'loss' | 'draw' = 'draw';
    let message = '';

    if (reason === 'checkmate_player') { 
      result = 'loss'; 
      message = isBot ? `${bot?.name} wins by Checkmate!` : 'Black wins by Checkmate!'; 
    }
    else if (reason === 'checkmate_bot') { 
      result = 'win'; 
      message = isBot ? 'You win by Checkmate! 🎉' : 'White wins by Checkmate! 🎉'; 
    }
    else if (reason === 'stalemate') { result = 'draw'; message = 'Draw by Stalemate'; }
    else if (reason === 'draw50') { result = 'draw'; message = 'Draw by 50-move rule'; }
    else if (reason === 'timeout_player') { 
      result = 'loss'; 
      message = isBot ? 'You lost on time!' : 'White lost on time!'; 
    }
    else if (reason === 'timeout_bot') { 
      result = 'win'; 
      message = isBot ? 'Bot lost on time! You win!' : 'Black lost on time!'; 
    }
    else if (reason === 'resign') { 
      result = 'loss'; 
      message = isBot ? 'You resigned.' : (gameState.turn === 'w' ? 'White resigned.' : 'Black resigned.'); 
    }

    if (isBot && botId) {
      await recordResult(botId, result);
    }
    navigation.navigate('Result', { result, message, botId, moves: moveNotations.length, mode });
  }, [gameOver, botId, moveNotations.length, navigation, bot?.name, isBot, mode, gameState.turn]);

  const handleMove = useCallback((move: Move) => {
    if (gameOver || botThinking) return;

    setHintMove(null);

    const notation = moveToNotation(gameState, move);
    const newState = applyMove(gameState, move);
    const newNotations = [...moveNotations, notation];
    const newHistory = [...stateHistory, newState];

    setLastMove(move);
    setGameState(newState);
    setStateHistory(newHistory);
    setMoveNotations(newNotations);
    setCurrentMoveIndex(newNotations.length - 1);

    const result = getGameResult(newState);
    if (result !== 'ongoing') {
      const winner = newState.turn === 'w' ? 'black' : 'white';
      handleGameOver(result === 'checkmate' ? (winner === 'white' ? 'checkmate_bot' : 'checkmate_player') : result);
      return;
    }

    if (isBot && newState.turn === 'b') {
      // Bot's turn
      setBotThinking(true);
      setTimeout(() => {
        if (!bot) return;
        const botMove = getBestMove(newState, bot.depth, bot.randomness, bot.preferAttack);
        if (!botMove) { setBotThinking(false); return; }

        const botNotation = moveToNotation(newState, botMove);
        const afterBot = applyMove(newState, botMove);
        const finalNotations = [...newNotations, botNotation];
        const finalHistory = [...newHistory, afterBot];

        setLastMove(botMove);
        setGameState(afterBot);
        setStateHistory(finalHistory);
        setMoveNotations(finalNotations);
        setCurrentMoveIndex(finalNotations.length - 1);
        setBotThinking(false);

        const botResult = getGameResult(afterBot);
        if (botResult !== 'ongoing') {
          handleGameOver(botResult === 'checkmate' ? 'checkmate_player' : botResult);
        }
      }, 300);
    }
  }, [gameOver, gameState, botThinking, moveNotations, stateHistory, bot, isBot, handleGameOver]);

  const handleHint = () => {
    if (!settings || botThinking) return;
    const limit = settings.hintLimit;
    if (limit !== -1 && hintsUsed >= limit) {
      Alert.alert('No Hints Left', `You have used all ${limit} hints for this game.`);
      return;
    }
    
    // Use requestAnimationFrame to ensure any pending UI updates finish first
    requestAnimationFrame(() => {
      setTimeout(() => {
        const hint = getHintMove(gameState);
        setHintMove(hint);
        setHintsUsed(h => h + 1);
      }, 100);
    });
  };

  const handleUndo = () => {
    if (!settings) return;
    const undoCount = isBot ? 2 : 1;
    if (stateHistory.length < undoCount + 1) return;
    
    if (settings.undoLimit !== -1 && undosUsed >= settings.undoLimit) {
      Alert.alert('No Undos Left', `You have used all ${settings.undoLimit} undos.`);
      return;
    }
    
    const newHistory = stateHistory.slice(0, -undoCount);
    const newNotations = moveNotations.slice(0, -undoCount);
    const prevState = newHistory[newHistory.length - 1];
    
    setGameState(prevState);
    setStateHistory(newHistory);
    setMoveNotations(newNotations);
    setCurrentMoveIndex(newNotations.length - 1);
    setLastMove(prevState.history[prevState.history.length - 1] || null);
    setUndosUsed(u => u + 1);
  };

  const handleResign = () => {
    if (!settings) return;
    if (settings.confirmResign) {
      Alert.alert('Resign?', 'Are you sure you want to resign?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resign', style: 'destructive', onPress: () => handleGameOver('resign') },
      ]);
    } else {
      handleGameOver('resign');
    }
  };

  const handleSelectMove = (index: number) => {
    setCurrentMoveIndex(index);
    setGameState(stateHistory[index + 1]);
  };

  if (!settings) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#6c63ff" size="large" />
      </View>
    );
  }

  const tc = TIME_CONTROLS[settings.timeControl];
  const unlimited = tc.seconds === 0;
  const material = getMaterialAdvantage(gameState);
  const inCheck = isInCheck(gameState);
  const hintLimit = settings.hintLimit === -1 ? '∞' : settings.hintLimit;
  const undoLimit = settings.undoLimit === -1 ? '∞' : settings.undoLimit;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Exit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isBot ? `${bot?.emoji} ${bot?.name}` : '👥 Local Multiplayer'}
        </Text>
        <TouchableOpacity onPress={() => setFlipped(f => !f)}>
          <Text style={styles.flipBtn}>⇅</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Top player info (Black) */}
        <View style={styles.playerRow}>
          <View>
            <Text style={styles.playerName}>
              {isBot ? `${bot?.emoji} ${bot?.name}` : '⚫ Black'}
            </Text>
          </View>
          {!unlimited && (
            <Timer seconds={botTime} active={gameState.turn === 'b'} onFlag={() => {}} unlimited={false} />
          )}
        </View>

        {/* Captured by Black */}
        <CapturedPieces
          captured={gameState.capturedByBlack}
          advantage={material < 0 ? Math.abs(material) / 100 : 0}
          label="Captured"
        />

        {/* Status */}
        {inCheck && (
          <View style={styles.checkBanner}>
            <Text style={styles.checkText}>⚠ CHECK!</Text>
          </View>
        )}

        {/* Board */}
        <ChessBoard
          state={gameState}
          flipped={flipped}
          onMove={handleMove}
          lastMove={lastMove}
          theme={settings.boardTheme}
          showCoordinates={settings.showCoordinates}
          showLegalMoves={settings.showLegalMoves}
          disabled={botThinking || gameOver}
          multiplayer={!isBot}
        />

        {/* Captured by White */}
        <CapturedPieces
          captured={gameState.capturedByWhite}
          advantage={material > 0 ? material / 100 : 0}
          label={isBot ? "You captured" : "White captured"}
        />

        {/* Bottom player info (White) */}
        <View style={styles.playerRow}>
          <View>
            <Text style={styles.playerName}>{isBot ? '👤 You' : '⚪ White'}</Text>
            {isBot && <Text style={styles.playerElo}>{tc.name}</Text>}
          </View>
          {!unlimited && (
            <Timer seconds={playerTime} active={gameState.turn === 'w' && !botThinking} onFlag={() => {}} unlimited={false} />
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.ctrlBtn, stateHistory.length < (isBot ? 3 : 2) && styles.ctrlDisabled]}
            onPress={handleUndo}
          >
            <Text style={styles.ctrlIcon}>↩</Text>
            <Text style={styles.ctrlLabel}>Undo</Text>
            <Text style={styles.ctrlSub}>{undosUsed}/{undoLimit}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.ctrlBtn, styles.resignBtn]} onPress={handleResign}>
            <Text style={styles.ctrlIcon}>🏳</Text>
            <Text style={[styles.ctrlLabel, { color: '#e24b4a' }]}>Resign</Text>
          </TouchableOpacity>
        </View>

        {/* Move History */}
        <MoveHistory
          moves={moveNotations}
          currentIndex={currentMoveIndex}
          onSelectMove={handleSelectMove}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  loading: { flex: 1, backgroundColor: '#0d0d0d', alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  back: { color: '#6c63ff', fontSize: 15 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  flipBtn: { color: '#aaa', fontSize: 22 },
  scroll: { padding: 12, gap: 10 },
  playerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 6,
  },
  playerName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  playerElo: { color: '#666', fontSize: 12 },
  checkBanner: {
    backgroundColor: '#e24b4a22', borderWidth: 1, borderColor: '#e24b4a',
    borderRadius: 8, padding: 8, alignItems: 'center',
  },
  checkText: { color: '#e24b4a', fontWeight: '800', fontSize: 14 },
  controls: { flexDirection: 'row', gap: 10 },
  ctrlBtn: {
    flex: 1, backgroundColor: '#1e1e1e', borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a',
  },
  ctrlDisabled: { opacity: 0.4 },
  resignBtn: { borderColor: '#e24b4a22' },
  ctrlIcon: { fontSize: 22 },
  ctrlLabel: { color: '#ccc', fontSize: 12, fontWeight: '600', marginTop: 4 },
  ctrlSub: { color: '#555', fontSize: 10, marginTop: 2 },
});
