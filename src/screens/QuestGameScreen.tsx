import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { Player, QuestTurn, CategoryId } from '../types';
import { QuestSettings } from '../hooks/useQuestGame';
import { getShuffledWords } from '../data/words';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../store/StoreContext';
import { generateHints } from '../utils/hints';

const { width } = Dimensions.get('window');

const PLAYER_COLORS = [
  '#D4A853',
  '#9B2335',
  '#2D6A4F',
  '#5E548E',
  '#E91E63',
  '#FF9800',
  '#00BCD4',
  '#4CAF50',
];

const CardCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const isTop = position === 'tl' || position === 'tr';
  const isLeft = position === 'tl' || position === 'bl';
  return (
    <View
      style={[
        styles.cardCorner,
        {
          top: isTop ? -1 : undefined,
          bottom: !isTop ? -1 : undefined,
          left: isLeft ? -1 : undefined,
          right: !isLeft ? -1 : undefined,
          borderTopWidth: isTop ? 2 : 0,
          borderBottomWidth: !isTop ? 2 : 0,
          borderLeftWidth: isLeft ? 2 : 0,
          borderRightWidth: !isLeft ? 2 : 0,
        },
      ]}
    />
  );
};

export const QuestGameScreen = ({ navigation, route }: any) => {
  const { lang, t } = useI18n();
  const { unlockedPacks } = useStore();

  const settings: QuestSettings = route.params.settings;
  const initialPlayers: Player[] = route.params.players;

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [storytellerIdx, setStorytellerIdx] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [phase, setPhase] = useState<'storyteller' | 'playing' | 'revealed'>('storyteller');
  const [turnHistory, setTurnHistory] = useState<QuestTurn[]>([]);
  const [turnCount, setTurnCount] = useState(1);

  // Shuffle words on mount
  useEffect(() => {
    const shuffled = getShuffledWords(
      settings.selectedCategories,
      settings.difficulty,
      lang,
      unlockedPacks
    );
    setWords(shuffled);
  }, []);

  const currentWord = words[wordIndex] || '';

  // Find category for current word
  const currentCategory = useMemo((): CategoryId => {
    if (!currentWord) return 'general';
    // Check each category's words to find which one contains the current word
    for (const cat of CATEGORIES) {
      // We do a simple heuristic: check the category name matching isn't perfect
      // since we don't have a reverse-lookup, default to 'general'
    }
    return 'general';
  }, [currentWord]);

  const categoryName = t.categoryNames[currentCategory] || t.categoryNames.general;

  const hints = useMemo(() => {
    if (!currentWord) return [];
    return generateHints(currentWord, categoryName, lang);
  }, [currentWord, categoryName, lang]);

  const storyteller = players[storytellerIdx];
  const otherPlayers = players.filter((_, i) => i !== storytellerIdx);

  const advanceTurn = (updatedPlayers: Player[]) => {
    // Check if anyone reached winning score
    const winner = updatedPlayers.find((p) => p.score >= settings.winningScore);
    if (winner) {
      navigation.replace('QuestScores', {
        players: updatedPlayers,
        turnHistory,
      });
      return;
    }

    // Advance to next storyteller
    const nextIdx = (storytellerIdx + 1) % updatedPlayers.length;
    setStorytellerIdx(nextIdx);
    setWordIndex((prev) => prev + 1);
    setHintsRevealed(0);
    setTurnCount((prev) => prev + 1);
    setPhase('storyteller');
  };

  const handleCorrectGuess = (guesserId: number) => {
    const guesser = players.find((p) => p.id === guesserId);
    if (!guesser) return;

    // Guesser gets +1, storyteller gets +1
    const updatedPlayers = players.map((p) => {
      if (p.id === guesserId) return { ...p, score: p.score + 1 };
      if (p.id === storyteller.id) return { ...p, score: p.score + 1 };
      return p;
    });
    setPlayers(updatedPlayers);

    const turn: QuestTurn = {
      storytellerId: storyteller.id,
      word: currentWord,
      category: currentCategory,
      guessedById: guesserId,
      hintsUsed: hintsRevealed,
      skipped: false,
    };
    setTurnHistory((prev) => [...prev, turn]);

    advanceTurn(updatedPlayers);
  };

  const handleNobodyGuessed = () => {
    // Storyteller gets -1 penalty
    const updatedPlayers = players.map((p) => {
      if (p.id === storyteller.id) return { ...p, score: p.score - 1 };
      return p;
    });
    setPlayers(updatedPlayers);

    const turn: QuestTurn = {
      storytellerId: storyteller.id,
      word: currentWord,
      category: currentCategory,
      guessedById: null,
      hintsUsed: hintsRevealed,
      skipped: true,
    };
    setTurnHistory((prev) => [...prev, turn]);

    setPhase('revealed');
  };

  const handleNextAfterReveal = () => {
    advanceTurn(players);
  };

  // Phase: Storyteller handoff
  if (phase === 'storyteller') {
    return (
      <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.storytellerContainer}>
          <View style={[styles.storytellerBadge, { backgroundColor: storyteller?.color + '25', borderColor: storyteller?.color + '60' }]}>
            <MaterialCommunityIcons name="book-open-page-variant" size={48} color={storyteller?.color} />
          </View>

          <Text style={styles.storytellerLabel}>{t.storyteller}</Text>
          <Text style={[styles.storytellerName, { color: storyteller?.color }]}>
            {storyteller?.name}
          </Text>

          <Text style={styles.passPhoneText}>
            {t.describeWord}
          </Text>

          {/* Mini scoreboard */}
          <View style={styles.miniScoreboard}>
            <Text style={styles.miniScoreTitle}>
              {t.pointsToWin}: {settings.winningScore}
            </Text>
            {players.map((p) => (
              <View key={p.id} style={styles.miniScoreRow}>
                <View style={[styles.miniDot, { backgroundColor: p.color }]} />
                <Text style={styles.miniScoreName} numberOfLines={1}>{p.name}</Text>
                <Text style={[styles.miniScoreValue, { color: p.color }]}>
                  {p.score} <Text style={styles.miniScoreExp}>{t.exp}</Text>
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.bigStartBtn, { backgroundColor: storyteller?.color }]}
            onPress={() => setPhase('playing')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="sword-cross" size={28} color="#FFF" />
            <Text style={styles.bigStartText}>{t.start}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // Phase: Revealed (nobody guessed)
  if (phase === 'revealed') {
    return (
      <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.revealedContainer}>
          <MaterialCommunityIcons name="eye" size={48} color={COLORS.skipGlow} />
          <Text style={styles.revealedLabel}>{t.wordRevealed}</Text>
          <Text style={styles.revealedWord}>{currentWord}</Text>

          <View style={styles.penaltyRow}>
            <View style={[styles.miniDot, { backgroundColor: storyteller?.color }]} />
            <Text style={styles.penaltyName}>{storyteller?.name}</Text>
            <Text style={styles.penaltyScore}>-1</Text>
          </View>

          <TouchableOpacity
            style={styles.nextTurnBtn}
            onPress={handleNextAfterReveal}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
            <Text style={styles.nextTurnText}>{t.nextTurn}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // Phase: Playing
  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={[styles.topDot, { backgroundColor: storyteller?.color }]} />
          <Text style={styles.topBarName} numberOfLines={1}>{storyteller?.name}</Text>
        </View>
        <View style={styles.turnBadge}>
          <Text style={styles.turnBadgeText}>#{turnCount}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.playingContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Parchment Word Card */}
        <View style={styles.wordCardContainer}>
          <View style={styles.wordCard}>
            <CardCorner position="tl" />
            <CardCorner position="tr" />
            <CardCorner position="bl" />
            <CardCorner position="br" />

            {/* Decorative top line */}
            <View style={styles.decorLine} />
            <Text style={styles.wordText}>{currentWord}</Text>
            {/* Decorative bottom line */}
            <View style={styles.decorLine} />
          </View>
        </View>

        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <MaterialCommunityIcons name="tag" size={14} color={COLORS.gold} />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>

        {/* Describe instruction */}
        <Text style={styles.instructionText}>{t.describeWord}</Text>

        {/* Hints section */}
        <View style={styles.hintsSection}>
          <View style={styles.hintsHeader}>
            <Text style={styles.hintsTitle}>{t.revealHint}</Text>
            <Text style={styles.hintsRemaining}>
              {5 - hintsRevealed} {t.hintsLeft}
            </Text>
          </View>

          <View style={styles.hintSlots}>
            {hints.map((hint, i) => (
              <View
                key={i}
                style={[
                  styles.hintSlot,
                  i < hintsRevealed && styles.hintSlotRevealed,
                ]}
              >
                {i < hintsRevealed ? (
                  <View style={styles.hintContent}>
                    <Text style={styles.hintType}>{hint.type}</Text>
                    <Text style={styles.hintValue}>{hint.value}</Text>
                  </View>
                ) : (
                  <MaterialCommunityIcons name="lock" size={16} color={COLORS.textSecondary} />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.revealHintBtn,
              hintsRevealed >= 5 && styles.revealHintBtnDisabled,
            ]}
            onPress={() => setHintsRevealed((prev) => Math.min(prev + 1, 5))}
            activeOpacity={0.7}
            disabled={hintsRevealed >= 5}
          >
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={18}
              color={hintsRevealed >= 5 ? COLORS.textSecondary : COLORS.background}
            />
            <Text
              style={[
                styles.revealHintText,
                hintsRevealed >= 5 && styles.revealHintTextDisabled,
              ]}
            >
              {t.revealHint}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Who guessed? */}
        <View style={styles.guessSection}>
          <Text style={styles.guessSectionTitle}>{t.whoGuessed}</Text>

          <View style={styles.playerGrid}>
            {otherPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[styles.playerButton, { borderColor: player.color + '60' }]}
                onPress={() => handleCorrectGuess(player.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.playerBtnDot, { backgroundColor: player.color }]} />
                <Text style={styles.playerBtnName} numberOfLines={1}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nobody guessed */}
          <TouchableOpacity
            style={styles.nobodyBtn}
            onPress={handleNobodyGuessed}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.skipGlow} />
            <Text style={styles.nobodyBtnText}>{t.nobodyGuessed}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },

  /* --- Storyteller Phase --- */
  storytellerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  storytellerBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  storytellerLabel: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 4,
  },
  storytellerName: {
    fontSize: 36,
    fontFamily: FONTS.displayBlack,
    marginBottom: 16,
  },
  passPhoneText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  miniScoreboard: {
    width: '100%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    padding: 16,
    marginBottom: 40,
  },
  miniScoreTitle: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  miniScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  miniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  miniScoreName: {
    flex: 1,
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  miniScoreValue: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBlack,
  },
  miniScoreExp: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  bigStartBtn: {
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
  bigStartText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: '#FFF',
    letterSpacing: 4,
  },

  /* --- Revealed Phase --- */
  revealedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  revealedLabel: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  revealedWord: {
    fontSize: 42,
    fontFamily: FONTS.displayBlack,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  penaltyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.skip + '15',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.skip + '30',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 40,
  },
  penaltyName: {
    flex: 1,
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  penaltyScore: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.skipGlow,
  },
  nextTurnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.correct,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: SIZES.radius,
    elevation: 6,
    shadowColor: COLORS.correctGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  nextTurnText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: '#FFF',
  },

  /* --- Playing Phase --- */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 12,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  topBarName: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  turnBadge: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  turnBadgeText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
  },
  playingContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },

  /* --- Parchment Card --- */
  wordCardContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  wordCard: {
    width: width - 48,
    backgroundColor: COLORS.parchment,
    borderRadius: SIZES.cardRadius,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.parchmentEdge,
    minHeight: 160,
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
  decorLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.parchmentEdge,
    marginVertical: 8,
  },
  wordText: {
    fontSize: 38,
    fontFamily: FONTS.displayBlack,
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 48,
    paddingVertical: 4,
  },

  /* --- Category Badge --- */
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: COLORS.gold + '15',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
  },

  /* --- Instruction --- */
  instructionText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  /* --- Hints --- */
  hintsSection: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
    padding: 14,
    marginBottom: 24,
  },
  hintsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hintsTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  hintsRemaining: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  hintSlots: {
    gap: 6,
    marginBottom: 12,
  },
  hintSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background + '80',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.gold + '10',
  },
  hintSlotRevealed: {
    backgroundColor: COLORS.gold + '10',
    borderColor: COLORS.gold + '30',
  },
  hintContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  hintType: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    minWidth: 90,
  },
  hintValue: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
    flex: 1,
  },
  revealHintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 12,
  },
  revealHintBtnDisabled: {
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.gold + '15',
  },
  revealHintText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.background,
  },
  revealHintTextDisabled: {
    color: COLORS.textSecondary,
  },

  /* --- Guess Section --- */
  guessSection: {
    marginBottom: 20,
  },
  guessSectionTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  playerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,168,83,0.06)',
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: (width - 48 - 10) / 2 - 1,
    flexGrow: 1,
  },
  playerBtnDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  playerBtnName: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
    flex: 1,
  },
  nobodyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.skip + '15',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.skip + '30',
    paddingVertical: 16,
  },
  nobodyBtnText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.skipGlow,
  },
});
