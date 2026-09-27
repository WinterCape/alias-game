import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useStats } from '../hooks/useStats';
import { useI18n } from '../i18n/I18nContext';
import { useReviewPrompt } from '../hooks/useReviewPrompt';
import { shareGameResults } from '../utils/share';
import { useAchievements } from '../achievements/AchievementContext';
import { useProgression } from '../progression/ProgressionContext';

export const GameOverScreen = ({ route, navigation }: any) => {
  const { resetGame, roundResults } = useGame();
  const { recordGame, stats } = useStats();
  const { lang, t } = useI18n();
  const { recordGamePlayed, showPrompt } = useReviewPrompt();
  const { checkArenaAchievements } = useAchievements();
  const { recordArenaResult } = useProgression();
  const { teams } = route.params;
  const hasRecorded = useRef(false);

  const sorted = [...teams].sort((a: any, b: any) => b.score - a.score);
  const winner = sorted[0];

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      recordGame(teams, roundResults);
      recordGamePlayed();

      const totalGuessed = roundResults.reduce((s: number, r: any) => s + r.guessedWords.length, 0);
      const totalSkipped = roundResults.reduce((s: number, r: any) => s + r.skippedWords.length, 0);
      const bestRound = roundResults.reduce((best: any, r: any) => (r.guessedWords.length > best.guessedWords.length ? r : best), roundResults[0]);
      checkArenaAchievements({
        gamesPlayed: stats.gamesPlayed + 1,
        totalWordsGuessed: stats.totalWordsGuessed + totalGuessed,
        roundGuessed: bestRound?.guessedWords.length || 0,
        roundSkipped: bestRound?.skippedWords.length || 0,
        gameSkipped: totalSkipped,
        language: lang,
      });

      // Count flawless rounds (rounds where skippedWords is empty)
      const flawlessRounds = roundResults.filter((r: any) => r.skippedWords.length === 0).length;

      recordArenaResult({
        wordsGuessed: totalGuessed,
        won: true,  // GameOver screen only shows for winners
        flawlessRounds,
      });
      setTimeout(() => {
        showPrompt({
          title: t.rateTitle,
          message: t.rateMessage,
          later: t.rateLater,
          now: t.rateNow,
        });
      }, 2000);
    }
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = () => {
    shareGameResults(winner.name, winner.score, teams, t.shareText);
  };

  const handleNewGame = () => {
    resetGame();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.winnerSection, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.trophyGlow}>
          <MaterialCommunityIcons name="trophy" size={80} color={COLORS.gold} />
        </View>
        <Text style={styles.congratsText}>{t.congratsChampion}</Text>
        <Text style={[styles.winnerName, { color: winner.color }]}>
          {winner.name}
        </Text>
        <Text style={styles.winnerScore}>
          {winner.score} <Text style={styles.winnerExp}>{t.exp}</Text>
        </Text>
      </Animated.View>

      <Animated.View style={[styles.standings, { opacity: fadeAnim }]}>
        <Text style={styles.standingsTitle}>{t.hallOfFame}</Text>
        {sorted.map((team: any, index: number) => (
          <View key={team.id} style={styles.standingRow}>
            <View style={styles.standingLeft}>
              {index === 0 && (
                <MaterialCommunityIcons name="trophy" size={20} color={COLORS.gold} />
              )}
              {index === 1 && (
                <MaterialCommunityIcons name="medal" size={20} color="#C0C0C0" />
              )}
              {index === 2 && (
                <MaterialCommunityIcons name="medal" size={20} color="#CD7F32" />
              )}
              {index > 2 && (
                <Text style={styles.standingIndex}>{index + 1}</Text>
              )}
              <View style={[styles.standingDot, { backgroundColor: team.color }]} />
              <Text style={styles.standingName}>{team.name}</Text>
            </View>
            <Text style={[styles.standingScore, { color: team.color }]}>
              {team.score} <Text style={styles.standingExp}>{t.exp}</Text>
            </Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="share-variant" size={20} color={COLORS.gold} />
          <Text style={styles.shareBtnText}>{t.shareResults}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newGameWrap}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.goldDim, COLORS.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.newGameButton}
          >
            <MaterialCommunityIcons name="sword-cross" size={24} color="#FFF" />
            <Text style={styles.newGameText}>{t.newAdventureShort}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trophyGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gold + '15',
    borderWidth: 2,
    borderColor: COLORS.gold + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.display,
    color: COLORS.gold,
    marginTop: 20,
  },
  winnerName: {
    fontSize: 40,
    fontFamily: FONTS.displayBlack,
    marginTop: 8,
  },
  winnerScore: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bodyBlack,
    color: COLORS.text,
    marginTop: 4,
  },
  winnerExp: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.gold,
  },
  standings: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.gold + '25',
  },
  standingsTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold + '12',
  },
  standingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  standingIndex: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    width: 20,
    textAlign: 'center',
  },
  standingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  standingName: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  standingScore: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bodyBlack,
  },
  standingExp: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: 30,
    gap: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
    backgroundColor: 'rgba(212,168,83,0.06)',
  },
  shareBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.md,
    color: COLORS.gold,
  },
  newGameWrap: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  newGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  newGameText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: '#FFF',
  },
});
