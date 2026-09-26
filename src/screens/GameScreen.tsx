import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { COLORS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useSounds } from '../hooks/useSounds';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

type GamePhase = 'ready' | 'playing' | 'finished';

export const GameScreen = ({ navigation }: any) => {
  const {
    settings,
    teams,
    currentTeamIndex,
    startNewRound,
    getCurrentWord,
    markCorrect,
    markSkipped,
    endRound,
    checkWinner,
  } = useGame();

  const { playCorrect, playSkip, playTick, playTimeUp, playStart } = useSounds();
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [currentWord, setCurrentWord] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const isAnimating = useRef(false);

  const pan = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashColorRef = useRef(COLORS.correct);

  const onTimerComplete = useCallback(() => {
    setPhase('finished');
    playTimeUp();
    Vibration.vibrate([0, 500, 200, 500]);
    const result = endRound();
    const winner = checkWinner();

    setTimeout(() => {
      if (winner) {
        navigation.replace('GameOver', { teams });
      } else {
        navigation.replace('RoundResult', { result });
      }
    }, 800);
  }, [endRound, checkWinner, navigation, teams]);

  const { timeLeft, start: startTimer, progress } = useTimer(
    settings.roundDuration,
    onTimerComplete
  );

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 10 && timeLeft > 0) {
      playTick();
    }
  }, [timeLeft, phase, playTick]);

  useEffect(() => {
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  const handleStartRound = () => {
    startNewRound();
    setCurrentWord(getCurrentWord());
    setPhase('playing');
    startTimer();
    playStart();
    setCorrectCount(0);
    setSkipCount(0);
  };

  const flashScreen = (color: string) => {
    flashColorRef.current = color;
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (direction: 'left' | 'right', callback: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const toValue = direction === 'right' ? width * 1.5 : -width * 1.5;

    Animated.parallel([
      Animated.timing(pan, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      pan.setValue(0);
      cardOpacity.setValue(1);
      isAnimating.current = false;
    });
  };

  const handleCorrect = useCallback(() => {
    if (phase !== 'playing' || isAnimating.current) return;
    playCorrect();
    flashScreen(COLORS.correct);
    animateOut('right', () => {
      markCorrect();
      setCorrectCount((p) => p + 1);
      setCurrentWord(getCurrentWord());
    });
  }, [phase, markCorrect, getCurrentWord, playCorrect]);

  const handleSkip = useCallback(() => {
    if (phase !== 'playing' || isAnimating.current) return;
    playSkip();
    flashScreen(COLORS.skip);
    Vibration.vibrate(100);
    animateOut('left', () => {
      markSkipped();
      setSkipCount((p) => p + 1);
      setCurrentWord(getCurrentWord());
    });
  }, [phase, markSkipped, getCurrentWord, playSkip]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (phase !== 'playing' || isAnimating.current) return;
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (phase !== 'playing' || isAnimating.current) return;
        if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
          handleCorrect();
        } else if (gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5) {
          handleSkip();
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  const currentTeam = teams[currentTeamIndex];
  const isUrgent = timeLeft <= 10;

  const cardRotation = pan.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const leftIndicatorOpacity = pan.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const rightIndicatorOpacity = pan.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const cardBorderColor = pan.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [COLORS.skip, 'rgba(255,255,255,0.12)', COLORS.correct],
    extrapolate: 'clamp',
  });

  if (phase === 'ready') {
    return (
      <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.readyContainer}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam?.color + '30' }]}>
            <MaterialCommunityIcons name="account-group" size={40} color={currentTeam?.color} />
          </View>
          <Text style={styles.readyTeamName}>{currentTeam?.name}</Text>
          <Text style={styles.readySubtext}>Pregătiți-vă!</Text>
          <Text style={styles.readyDesc}>
            Dă telefonul jucătorului care descrie.{'\n'}
            Restul echipei trebuie să ghicească.{'\n\n'}
            <Text style={{ color: COLORS.correct }}>Glisează dreapta</Text> = corect{'\n'}
            <Text style={{ color: COLORS.skip }}>Glisează stânga</Text> = sari
          </Text>

          <View style={styles.scoreBoard}>
            {teams.map((team) => (
              <View key={team.id} style={styles.scoreBoardItem}>
                <View style={[styles.scoreDot, { backgroundColor: team.color }]} />
                <Text style={styles.scoreBoardName}>{team.name}</Text>
                <Text style={[styles.scoreBoardScore, { color: team.color }]}>
                  {team.score}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.startRoundBtn, { backgroundColor: currentTeam?.color }]}
            onPress={handleStartRound}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="play" size={32} color="#FFF" />
            <Text style={styles.startRoundText}>START</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Flash overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            backgroundColor: flashColorRef.current,
            opacity: flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />

      {/* Timer Bar */}
      <View style={styles.timerBarContainer}>
        <View
          style={[
            styles.timerBar,
            {
              width: `${progress * 100}%`,
              backgroundColor: isUrgent ? COLORS.danger : currentTeam?.color,
            },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.gameHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.miniTeamDot, { backgroundColor: currentTeam?.color }]} />
          <Text style={styles.headerTeam}>{currentTeam?.name}</Text>
        </View>
        <View style={[styles.timerCircle, isUrgent && styles.timerCircleUrgent]}>
          <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
            {timeLeft}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>
            <Text style={{ color: COLORS.correct }}>+{correctCount}</Text>
            {'  '}
            <Text style={{ color: COLORS.skip }}>-{skipCount}</Text>
          </Text>
        </View>
      </View>

      {/* Swipe Direction Indicators */}
      <View style={styles.swipeHintRow}>
        <Animated.View style={[styles.swipeHint, { opacity: leftIndicatorOpacity }]}>
          <MaterialCommunityIcons name="close" size={20} color={COLORS.skip} />
          <Text style={[styles.swipeHintText, { color: COLORS.skip }]}>SARI</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeHint, { opacity: rightIndicatorOpacity }]}>
          <Text style={[styles.swipeHintText, { color: COLORS.correct }]}>CORECT</Text>
          <MaterialCommunityIcons name="check" size={20} color={COLORS.correct} />
        </Animated.View>
      </View>

      {/* Word Card with PanResponder */}
      <View style={styles.wordContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.wordCard,
            {
              transform: [
                { translateX: pan },
                { rotate: cardRotation },
              ],
              opacity: cardOpacity,
              borderColor: cardBorderColor,
            },
          ]}
        >
          <Text style={styles.wordText}>{currentWord}</Text>
        </Animated.View>
      </View>

      {/* Action Buttons (still available as fallback) */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="close" size={40} color="#FFF" />
          <Text style={styles.actionLabel}>Sări</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.correctButton]}
          onPress={handleCorrect}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="check" size={40} color="#FFF" />
          <Text style={styles.actionLabel}>Corect</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  readyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  teamBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  readyTeamName: {
    fontSize: SIZES.xxl,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  readySubtext: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  readyDesc: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  scoreBoard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 40,
  },
  scoreBoardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  scoreBoardName: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  scoreBoardScore: {
    fontSize: SIZES.lg,
    fontWeight: '800',
  },
  startRoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: SIZES.radius,
    elevation: 8,
  },
  startRoundText: {
    fontSize: SIZES.xl,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 4,
  },
  timerBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 50,
  },
  timerBar: {
    height: '100%',
    borderRadius: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniTeamDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  headerTeam: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  timerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  timerCircleUrgent: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '20',
  },
  timerText: {
    fontSize: SIZES.xl,
    fontWeight: '900',
    color: COLORS.text,
  },
  timerTextUrgent: {
    color: COLORS.danger,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  swipeHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: SIZES.sm,
    fontWeight: '800',
    letterSpacing: 2,
  },
  wordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  wordCard: {
    width: width - 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    minHeight: 200,
  },
  wordText: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 52,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 50,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  skipButton: {
    backgroundColor: COLORS.skip,
  },
  correctButton: {
    backgroundColor: COLORS.correct,
  },
  actionLabel: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
});
