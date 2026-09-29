import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useSounds } from '../hooks/useSounds';
import { useConfirmLeave } from '../hooks/useConfirmLeave';
import { getGameNumber, getRoundNumber } from '../hooks/arenaSession';
import { getTaskPool, pickTask, TASK_GROUP_ICONS } from '../data/tasks';
import { ArcanaCard } from '../components/ArcanaCard';
import { getWordRealm } from '../utils/realm';
import { useI18n } from '../i18n/I18nContext';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

type GamePhase = 'ready' | 'playing' | 'lastWord' | 'finished';

const CORNER_INSET = 8;
const EIGHT_WORDS = 8;

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
    abandonGame,
    roundResults,
    sessionWins,
    dealWords,
    setWordGuessed,
    getLastTaskId,
    setLastTaskId,
  } = useGame();

  const { lang, t } = useI18n();

  // Task rounds: decided once when the pre-round screen opens
  const [task] = useState(() =>
    pickTask(
      getTaskPool(lang, settings.disabledTasks, settings.customTasks),
      settings.taskFrequency ?? 'off',
      getLastTaskId()
    )
  );
  useEffect(() => {
    if (task) setLastTaskId(task.id);
  }, [task, setLastTaskId]);
  const leave = useConfirmLeave(navigation, {
    title: t.quitArenaTitle,
    message: t.quitArenaMessage,
    confirm: t.quitQuestConfirm,
    cancel: t.cancel,
    onConfirm: abandonGame,
  });
  const { playCorrect, playSkip, playTick, playTimeUp, playStart } = useSounds(
    settings.soundEnabled !== false
  );
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [currentWord, setCurrentWord] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const isAnimating = useRef(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  // The word on screen, read when the timer ends (the callback outlives renders)
  const currentWordRef = useRef('');
  currentWordRef.current = currentWord;

  const lastWordTime = settings.lastWordTime ?? 'off';

  // 8 words mode: the current card and which of its words have been tapped as guessed
  const isEight = settings.arenaMode === 'eight';
  const [card, setCard] = useState<string[]>([]);
  const [cardGuessed, setCardGuessed] = useState<boolean[]>([]);
  // Source of truth for taps: quick taps can arrive before the next render
  const cardRef = useRef<string[]>([]);
  const cardGuessedRef = useRef<boolean[]>([]);

  const pan = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashColorRef = useRef(COLORS.correct);

  // Every round ends on the round review, which also decides if someone has won
  const finishRound = useCallback((lastWord?: { word: string; teamId: number | null }) => {
    setPhase('finished');
    endRound(lastWord);
    setTimeout(() => leave(StackActions.replace('RoundResult')), lastWord ? 300 : 800);
  }, [endRound, leave]);

  const onLastWordTimeout = useCallback(() => {
    finishRound({ word: currentWordRef.current, teamId: null });
  }, [finishRound]);

  const lastWordTimer = useTimer(
    typeof lastWordTime === 'number' ? lastWordTime : 1,
    onLastWordTimeout
  );

  const onTimerComplete = useCallback(() => {
    playTimeUp();
    Vibration.vibrate([0, 500, 200, 500]);
    // Classic mode can give the word on screen a last chance
    if (!isEight && lastWordTime !== 'off' && currentWordRef.current) {
      setPhase('lastWord');
      if (typeof lastWordTime === 'number') lastWordTimer.start();
      return;
    }
    finishRound();
  }, [finishRound, playTimeUp, isEight, lastWordTime, lastWordTimer.start]);

  const {
    timeLeft,
    start: startTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    progress,
  } = useTimer(settings.roundDuration, onTimerComplete);

  const resolveLastWord = (teamId: number | null) => {
    if (phase !== 'lastWord') return;
    lastWordTimer.pause();
    if (teamId !== null) playCorrect();
    finishRound({ word: currentWord, teamId });
  };

  const pauseGame = useCallback(() => {
    if (phaseRef.current !== 'playing' || pausedRef.current) return;
    pauseTimer();
    setPaused(true);
  }, [pauseTimer]);

  const resumeGame = () => {
    setPaused(false);
    resumeTimer();
  };

  // Pause automatically when the app goes to the background (a call, a lock)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') pauseGame();
    });
    return () => sub.remove();
  }, [pauseGame]);

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

  const dealCard = () => {
    const next = dealWords(EIGHT_WORDS);
    cardRef.current = next;
    cardGuessedRef.current = next.map(() => false);
    setCard(next);
    setCardGuessed(cardGuessedRef.current);
  };

  const handleStartRound = () => {
    startNewRound();
    if (isEight) {
      dealCard();
    } else {
      setCurrentWord(getCurrentWord());
    }
    setPhase('playing');
    startTimer();
    playStart();
    setCorrectCount(0);
    setSkipCount(0);
  };

  // 8 words mode: tap a word to mark it guessed, tap again to undo.
  // When the whole card is guessed, a new card is dealt.
  const phaseForCard = useRef(phase);
  phaseForCard.current = phase;
  const toggleCardWord = (index: number) => {
    if (phaseForCard.current !== 'playing' || pausedRef.current) return;
    const current = cardGuessedRef.current;
    if (index >= current.length || current.every(Boolean)) return;
    const guessed = !current[index];
    setWordGuessed(cardRef.current[index], guessed);
    const nextGuessed = current.map((g, i) => (i === index ? guessed : g));
    cardGuessedRef.current = nextGuessed;
    setCardGuessed(nextGuessed);
    setCorrectCount((p) => p + (guessed ? 1 : -1));
    if (guessed) {
      playCorrect();
      flashScreen(COLORS.correctGlow);
    }
    if (nextGuessed.every(Boolean)) {
      setTimeout(() => {
        if (phaseForCard.current === 'playing') dealCard();
      }, 400);
    }
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
    if (phase !== 'playing' || pausedRef.current || isAnimating.current) return;
    playCorrect();
    flashScreen(COLORS.correctGlow);
    animateOut('right', () => {
      markCorrect();
      setCorrectCount((p) => p + 1);
      setCurrentWord(getCurrentWord());
    });
  }, [phase, markCorrect, getCurrentWord, playCorrect]);

  const handleSkip = useCallback(() => {
    if (phase !== 'playing' || pausedRef.current || isAnimating.current) return;
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
        if (phaseRef.current !== 'playing' || pausedRef.current || isAnimating.current) return;
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (phaseRef.current !== 'playing' || pausedRef.current || isAnimating.current) return;
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
  const realm = useMemo(() => getWordRealm(currentWord, lang, t), [currentWord, lang, t]);
  // Card number for this turn: the how-many-th word it is
  const wordNumber = correctCount + skipCount + 1;
  const roundNumber = getRoundNumber(roundResults.length, teams.length);
  const gameNumber = getGameNumber(sessionWins);

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
    outputRange: [COLORS.skipGlow, COLORS.gold, COLORS.correctGlow],
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
            {isEight ? (
              <Text style={{ color: COLORS.correctGlow, fontFamily: FONTS.bodyBold }}>{t.tapGuessedWords}</Text>
            ) : (
              <>
                <Text style={{ color: COLORS.correctGlow, fontFamily: FONTS.bodyBold }}>{t.swipeRightCorrect}</Text>{'\n'}
                <Text style={{ color: COLORS.skipGlow, fontFamily: FONTS.bodyBold }}>{t.swipeLeftSkip}</Text>
              </>
            )}
          </Text>

          <Text style={styles.readyMeta}>
            {gameNumber > 1 ? `${t.gameLabel} ${gameNumber} · ` : ''}
            {t.roundLabel} {roundNumber} · {t.targetLabel} {settings.winningScore}
          </Text>

          {task && (
            <View style={styles.taskCard}>
              <View style={styles.taskCardHeader}>
                <MaterialCommunityIcons name={TASK_GROUP_ICONS[task.group] as any} size={20} color={COLORS.ink} />
                <Text style={styles.taskCardTitle}>{t.taskRoundTitle}</Text>
              </View>
              <Text style={styles.taskCardText}>{task.text}</Text>
            </View>
          )}

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

  // Time is up: the word on screen gets a last chance
  if (phase === 'lastWord') {
    const shared = settings.sharedLastWord === true;
    return (
      <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Empty timer bar: the round time is up; keeps the header in the same place */}
        <View style={styles.timerBarContainer} />
        <View style={styles.gameHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.miniTeamDot, { backgroundColor: currentTeam?.color }]} />
            <Text style={styles.headerTeam}>{currentTeam?.name}</Text>
          </View>
          <View style={[styles.timerCircle, styles.timerCircleUrgent]}>
            <Text style={[styles.timerText, styles.timerTextUrgent]}>
              {typeof lastWordTime === 'number' ? lastWordTimer.timeLeft : '∞'}
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

        <View style={styles.lastWordContainer}>
          <View style={styles.lastWordTag}>
            <MaterialCommunityIcons name="timer-sand-complete" size={16} color={COLORS.ink} />
            <Text style={styles.lastWordTagText}>{t.lastWordTag.toUpperCase()}</Text>
          </View>
          <ArcanaCard word={currentWord} realm={realm} number={wordNumber} style={styles.arcana} />
        </View>

        {shared ? (
          <View style={styles.lastWordTeams}>
            <Text style={styles.lastWordQuestion}>{t.whoGuessedLastWord}</Text>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                style={[styles.lastWordTeamBtn, { borderColor: team.color, backgroundColor: team.color + '22' }]}
                onPress={() => resolveLastWord(team.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.miniTeamDot, { backgroundColor: team.color }]} />
                <Text style={styles.lastWordTeamText}>{team.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.lastWordNobodyBtn}
              onPress={() => resolveLastWord(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.lastWordNobodyText}>{t.nobody}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => resolveLastWord(null)}
              activeOpacity={0.7}
              style={styles.actionButtonWrap}
            >
              <LinearGradient
                colors={['#5C1A24', COLORS.skip]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons name="close-circle-outline" size={36} color="#FFF" />
                <Text style={styles.actionLabel}>{t.nobody}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => resolveLastWord(currentTeam?.id ?? currentTeamIndex)}
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
        )}
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
            {!isEight && (
              <>
                {'  '}
                <Text style={{ color: COLORS.skipGlow }}>-{skipCount}</Text>
              </>
            )}
          </Text>
        </View>
      </View>

      <View style={styles.pauseRow}>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={pauseGame}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t.pause}
        >
          <MaterialCommunityIcons name="pause" size={18} color={COLORS.textSecondary} />
          <Text style={styles.pauseBtnText}>{t.pause}</Text>
        </TouchableOpacity>
      </View>

      {task && (
        <View style={styles.taskReminder}>
          <MaterialCommunityIcons name={TASK_GROUP_ICONS[task.group] as any} size={16} color={COLORS.gold} />
          <Text style={styles.taskReminderText} numberOfLines={2}>{task.text}</Text>
        </View>
      )}

      {isEight ? (
        <View style={styles.eightContainer}>
          <Text style={styles.eightHint}>{t.tapGuessedWords}</Text>
          <View style={styles.eightCard}>
            <CardCorner position="tl" />
            <CardCorner position="tr" />
            <CardCorner position="bl" />
            <CardCorner position="br" />
            {card.map((word, index) => (
              <TouchableOpacity
                key={`${word}-${index}`}
                style={[styles.eightRow, cardGuessed[index] && styles.eightRowGuessed]}
                onPress={() => toggleCardWord(index)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: cardGuessed[index] }}
              >
                <MaterialCommunityIcons
                  name={cardGuessed[index] ? 'check-circle' : 'circle-outline'}
                  size={22}
                  color={cardGuessed[index] ? COLORS.correctGlow : COLORS.goldDim}
                />
                <Text
                  style={[styles.eightWord, cardGuessed[index] && styles.eightWordGuessed]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
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
              styles.arcana,
              {
                transform: [
                  { translateX: pan },
                  { rotate: cardRotation },
                ],
                opacity: cardOpacity,
              },
            ]}
          >
            <ArcanaCard
              word={currentWord}
              realm={realm}
              number={wordNumber}
              minHeight={340}
              style={{ borderColor: cardBorderColor }}
            />
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
        </>
      )}

      {/* Paused: the word is hidden so nobody can peek */}
      {paused && (
        <View style={styles.pausedOverlay}>
          <MaterialCommunityIcons name="pause-circle" size={64} color={COLORS.gold} />
          <Text style={styles.pausedTitle}>{t.paused}</Text>
          <Text style={styles.pausedTime}>{timeLeft}s</Text>
          <TouchableOpacity
            style={[styles.startRoundBtn, { backgroundColor: currentTeam?.color ?? COLORS.gold }]}
            onPress={resumeGame}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="play" size={28} color="#FFF" />
            <Text style={styles.startRoundText}>{t.resume}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  readyMeta: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
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
  arcana: {
    width: width - 48,
  },
  cardCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.gold,
  },

  /* --- Task Rounds --- */
  taskCard: {
    width: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: SIZES.cardRadius,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    gap: 6,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCardTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBlack,
    color: COLORS.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  taskCardText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.ink,
  },
  taskReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    maxWidth: '90%',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(212,168,83,0.12)',
  },
  taskReminderText: {
    flexShrink: 1,
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
  },

  /* --- Pause --- */
  pauseRow: {
    alignItems: 'center',
    marginTop: -4,
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    backgroundColor: 'rgba(212,168,83,0.06)',
  },
  pauseBtnText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pausedTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.display,
    color: COLORS.gold,
  },
  pausedTime: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  /* --- Last Word --- */
  lastWordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  lastWordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
  },
  lastWordTagText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBlack,
    color: COLORS.ink,
    letterSpacing: 2,
  },
  lastWordTeams: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 10,
  },
  lastWordQuestion: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  lastWordTeamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
  },
  lastWordTeamText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  lastWordNobodyBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  lastWordNobodyText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },

  /* --- 8 Words Mode --- */
  eightContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  eightHint: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  eightCard: {
    backgroundColor: '#1A1530',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 6,
  },
  eightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  eightRowGuessed: {
    backgroundColor: 'rgba(45,106,79,0.25)',
  },
  eightWord: {
    flex: 1,
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: COLORS.parchment,
  },
  eightWordGuessed: {
    color: COLORS.correctGlow,
    textDecorationLine: 'line-through',
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
