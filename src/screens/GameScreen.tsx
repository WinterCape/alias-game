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
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useSounds } from '../hooks/useSounds';
import { useI18n } from '../i18n/I18nContext';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

type GamePhase = 'ready' | 'playing' | 'finished';

const CORNER_INSET = 8;

const CardCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const isTop = position === 'tl' || position === 'tr';
  const isLeft = position === 'tl' || position === 'bl';
  return (
    <View
      style={[
        styles.cardCorner,
        {
          // Inset from the edge so the bracket sits inside the card's rounded corner
          top: isTop ? CORNER_INSET : undefined,
          bottom: !isTop ? CORNER_INSET : undefined,
          left: isLeft ? CORNER_INSET : undefined,
          right: !isLeft ? CORNER_INSET : undefined,
          borderTopWidth: isTop ? 2 : 0,
          borderBottomWidth: !isTop ? 2 : 0,
          borderLeftWidth: isLeft ? 2 : 0,
          borderRightWidth: !isLeft ? 2 : 0,
          borderTopLeftRadius: position === 'tl' ? 4 : 0,
          borderTopRightRadius: position === 'tr' ? 4 : 0,
          borderBottomLeftRadius: position === 'bl' ? 4 : 0,
          borderBottomRightRadius: position === 'br' ? 4 : 0,
        },
      ]}
    />
  );
};

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

  const { t } = useI18n();
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
    const { result, updatedTeams } = endRound();
    const winner = checkWinner(updatedTeams);

    setTimeout(() => {
      if (winner) {
        navigation.replace('GameOver', { teams: updatedTeams });
      } else {
        navigation.replace('RoundResult', { result });
      }
    }, 800);
  }, [endRound, checkWinner, navigation]);

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
    flashScreen(COLORS.correctGlow);
    animateOut('right', () => {
      markCorrect();
      setCorrectCount((p) => p + 1);
      setCurrentWord(getCurrentWord());
    });
  }, [phase, markCorrect, getCurrentWord, playCorrect]);

  const handleSkip = useCallback(() => {
    if (phase !== 'playing' || isAnimating.current) return;
    playSkip();
    flashScreen(COLORS.skipGlow);
    Vibration.vibrate(100);
    animateOut('left', () => {
      markSkipped();
      setSkipCount((p) => p + 1);
      setCurrentWord(getCurrentWord());
    });
  }, [phase, markSkipped, getCurrentWord, playSkip]);

  // The pan responder is created once, so it reads the latest phase and
  // handlers through refs instead of the values from the first render.
  const phaseRef = useRef(phase);
  const handleCorrectRef = useRef(handleCorrect);
  const handleSkipRef = useRef(handleSkip);
  phaseRef.current = phase;
  handleCorrectRef.current = handleCorrect;
  handleSkipRef.current = handleSkip;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (phaseRef.current !== 'playing' || isAnimating.current) return;
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (phaseRef.current !== 'playing' || isAnimating.current) return;
        if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
          handleCorrectRef.current();
        } else if (gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5) {
          handleSkipRef.current();
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
    outputRange: [COLORS.skipGlow, COLORS.parchmentEdge, COLORS.correctGlow],
    extrapolate: 'clamp',
  });

  if (phase === 'ready') {
    return (
      <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.readyContainer}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam?.color + '25', borderColor: currentTeam?.color + '60' }]}>
            <MaterialCommunityIcons name="shield-account" size={40} color={currentTeam?.color} />
          </View>
          <Text style={styles.readyTeamName}>{currentTeam?.name}</Text>
          <Text style={styles.readySubtext}>{t.prepareHeroes}</Text>
          <Text style={styles.readyDesc}>
            {t.givePhone}{'\n\n'}
            <Text style={{ color: COLORS.correctGlow, fontFamily: FONTS.bodyBold }}>{t.swipeRightCorrect}</Text>{'\n'}
            <Text style={{ color: COLORS.skipGlow, fontFamily: FONTS.bodyBold }}>{t.swipeLeftSkip}</Text>
          </Text>

          <View style={styles.scoreBoard}>
            <Text style={styles.scoreBoardTitle}>{t.guildRanking}</Text>
            {teams.map((team) => (
              <View key={team.id} style={styles.scoreBoardItem}>
                <View style={[styles.scoreDot, { backgroundColor: team.color }]} />
                <Text style={styles.scoreBoardName}>{team.name}</Text>
                <Text style={[styles.scoreBoardScore, { color: team.color }]}>
                  {team.score} <Text style={styles.scoreBoardExp}>{t.exp}</Text>
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.startRoundBtn, { backgroundColor: currentTeam?.color }]}
            onPress={handleStartRound}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="sword-cross" size={28} color="#FFF" />
            <Text style={styles.startRoundText}>{t.start}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
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
              outputRange: [0, 0.35],
            }),
          },
        ]}
      />

      {/* Timer Bar */}
      <View style={styles.timerBarContainer}>
        <LinearGradient
          colors={isUrgent ? [COLORS.danger, COLORS.skip] : [COLORS.goldDim, COLORS.gold, COLORS.goldBright]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.timerBar,
            { width: `${progress * 100}%` },
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
            <Text style={{ color: COLORS.correctGlow }}>+{correctCount}</Text>
            {'  '}
            <Text style={{ color: COLORS.skipGlow }}>-{skipCount}</Text>
          </Text>
        </View>
      </View>

      {/* Swipe Direction Indicators */}
      <View style={styles.swipeHintRow}>
        <Animated.View style={[styles.swipeHint, { opacity: leftIndicatorOpacity }]}>
          <MaterialCommunityIcons name="shield-off" size={18} color={COLORS.skipGlow} />
          <Text style={[styles.swipeHintText, { color: COLORS.skipGlow }]}>{t.retreat.toUpperCase()}</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeHint, { opacity: rightIndicatorOpacity }]}>
          <Text style={[styles.swipeHintText, { color: COLORS.correctGlow }]}>{t.victory.toUpperCase()}</Text>
          <MaterialCommunityIcons name="sword" size={18} color={COLORS.correctGlow} />
        </Animated.View>
      </View>

      {/* Word Card with PanResponder — Parchment Card */}
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
          <CardCorner position="tl" />
          <CardCorner position="tr" />
          <CardCorner position="bl" />
          <CardCorner position="br" />
          <Text style={styles.wordText}>{currentWord}</Text>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          style={styles.actionButtonWrap}
        >
          <LinearGradient
            colors={['#5C1A24', COLORS.skip]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="shield-off" size={36} color="#FFF" />
            <Text style={styles.actionLabel}>{t.retreat}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCorrect}
          activeOpacity={0.7}
          style={styles.actionButtonWrap}
        >
          <LinearGradient
            colors={['#1B4332', COLORS.correct]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="sword" size={36} color="#FFF" />
            <Text style={styles.actionLabel}>{t.victory}</Text>
          </LinearGradient>
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

  /* --- Ready Phase --- */
  readyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  teamBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  readyTeamName: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.text,
    marginBottom: 6,
  },
  readySubtext: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.display,
    color: COLORS.gold,
    marginBottom: 16,
  },
  readyDesc: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  scoreBoard: {
    width: '100%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    padding: 16,
    marginBottom: 40,
  },
  scoreBoardTitle: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  scoreBoardScore: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBlack,
  },
  scoreBoardExp: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startRoundText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: '#FFF',
    letterSpacing: 4,
  },

  /* --- Playing Phase --- */
  timerBarContainer: {
    height: 5,
    backgroundColor: COLORS.backgroundLight,
    marginTop: 50,
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
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
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  timerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  timerCircleUrgent: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '20',
  },
  timerText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
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
    fontFamily: FONTS.bodyBold,
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
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBlack,
    letterSpacing: 2,
  },

  /* --- Parchment Word Card --- */
  wordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  wordCard: {
    width: width - 48,
    backgroundColor: COLORS.parchment,
    borderRadius: SIZES.cardRadius,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.parchmentEdge,
    minHeight: 200,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  cardCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.gold,
  },
  wordText: {
    fontSize: 42,
    fontFamily: FONTS.displayBlack,
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 52,
  },

  /* --- Action Buttons --- */
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 50,
    gap: 16,
  },
  actionButtonWrap: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  actionLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
});
