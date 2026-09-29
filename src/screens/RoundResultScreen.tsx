import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions, StackActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useConfirmLeave } from '../hooks/useConfirmLeave';
import { toggleRoundWord } from '../hooks/arenaSession';
import { useI18n } from '../i18n/I18nContext';

export const RoundResultScreen = ({ navigation }: any) => {
  const { teams, abandonGame, roundResults, reviseLastRound, checkWinner, recordWin } = useGame();
  // Always the latest version of the round, so corrections show up immediately
  const result = roundResults[roundResults.length - 1];
  const { t } = useI18n();
  const leave = useConfirmLeave(navigation, {
    title: t.quitArenaTitle,
    message: t.quitArenaMessage,
    confirm: t.quitQuestConfirm,
    cancel: t.cancel,
    onConfirm: abandonGame,
  });
  if (!result) return null;
  const team = teams[result.teamId];

  // Round review: tap a word to move it between guessed and skipped
  const toggleWord = (word: string) => {
    reviseLastRound(toggleRoundWord(result, word));
  };

  // Last word: tap to cycle who guessed it (nobody, then each team)
  const cycleLastWord = () => {
    if (!result.lastWord) return;
    const options: (number | null)[] = [null, ...teams.map((tt) => tt.id)];
    const index = options.indexOf(result.lastWord.teamId);
    const teamId = options[(index + 1) % options.length];
    reviseLastRound({ ...result, lastWord: { ...result.lastWord, teamId } });
  };
  const lastWordTeam = result.lastWord?.teamId != null ? teams.find((tt) => tt.id === result.lastWord?.teamId) : undefined;

  const winner = checkWinner(teams);

  const handleNext = () => {
    if (winner) {
      recordWin(winner.id);
      // Only Home stays underneath, so back from the winner screen goes Home
      leave(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'GameOver', params: { teams } }],
        })
      );
    } else {
      leave(StackActions.replace('Game'));
    }
  };

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>{t.roundResult}</Text>
        <Text style={[styles.teamName, { color: team?.color }]}>{team?.name}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={[styles.scoreBadge, { borderColor: team?.color }]}>
          <Text style={[styles.scoreValue, { color: team?.color }]}>
            {result.score > 0 ? '+' : ''}{result.score}
          </Text>
          <Text style={styles.scoreLabel}>{t.exp}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="sword" size={24} color={COLORS.correctGlow} />
            <Text style={styles.statValue}>{result.guessedWords.length}</Text>
            <Text style={styles.statLabel}>{t.conquered}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="shield-off" size={24} color={COLORS.skipGlow} />
            <Text style={styles.statValue}>{result.skippedWords.length}</Text>
            <Text style={styles.statLabel}>{t.retreated}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.wordList} showsVerticalScrollIndicator={false}>
        {(result.guessedWords.length > 0 || result.skippedWords.length > 0 || result.lastWord) && (
          <Text style={styles.reviewHint}>{t.tapToFixWords}</Text>
        )}

        {result.guessedWords.length > 0 && (
          <View style={styles.wordSection}>
            <Text style={styles.wordSectionTitle}>{t.wordsConquered}</Text>
            {result.guessedWords.map((word: string) => (
              <TouchableOpacity
                key={word}
                style={styles.wordItem}
                onPress={() => toggleWord(word)}
                activeOpacity={0.6}
              >
                <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.correctGlow} />
                <Text style={styles.wordText}>{word}</Text>
                <View style={styles.toggleBtn}>
                  <MaterialCommunityIcons name="close-circle" size={22} color={COLORS.skipGlow} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {result.skippedWords.length > 0 && (
          <View style={styles.wordSection}>
            <Text style={styles.wordSectionTitle}>{t.wordsRetreated}</Text>
            {result.skippedWords.map((word: string) => (
              <TouchableOpacity
                key={word}
                style={styles.wordItem}
                onPress={() => toggleWord(word)}
                activeOpacity={0.6}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.skipGlow} />
                <Text style={[styles.wordText, { color: COLORS.textSecondary }]}>{word}</Text>
                <View style={styles.toggleBtn}>
                  <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.correctGlow} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {result.lastWord && (
          <View style={styles.wordSection}>
            <Text style={styles.wordSectionTitle}>{t.lastWordTag}</Text>
            <TouchableOpacity style={styles.wordItem} onPress={cycleLastWord} activeOpacity={0.6}>
              <MaterialCommunityIcons
                name="timer-sand-complete"
                size={16}
                color={lastWordTeam ? lastWordTeam.color : COLORS.textSecondary}
              />
              <Text style={styles.wordText}>{result.lastWord.word}</Text>
              <Text style={[styles.lastWordOwner, { color: lastWordTeam?.color ?? COLORS.textSecondary }]}>
                {lastWordTeam ? `${lastWordTeam.name} +1` : t.nobody}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Current Standings */}
      <View style={styles.standings}>
        <Text style={styles.standingsTitle}>{t.guildRanking}</Text>
        {[...teams].sort((a, b) => b.score - a.score).map((tt, i) => (
          <View key={tt.id} style={styles.standingItem}>
            <Text style={styles.standingPos}>{i + 1}.</Text>
            <View style={[styles.standingDot, { backgroundColor: tt.color }]} />
            <Text style={styles.standingName}>{tt.name}</Text>
            <Text style={[styles.standingScore, { color: tt.color }]}>
              {tt.score} <Text style={styles.standingExp}>{t.exp}</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButtonWrap}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.goldDim, COLORS.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            <MaterialCommunityIcons name={winner ? 'trophy' : 'sword-cross'} size={22} color="#FFF" />
            <Text style={styles.nextButtonText}>{winner ? t.seeWinner : t.nextMission}</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  teamName: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreBadge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight,
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.displayBlack,
  },
  scoreLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gold + '30',
  },
  statValue: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bodyBlack,
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  wordList: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  wordSection: {
    marginBottom: 16,
  },
  wordSectionTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordText: {
    flex: 1,
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.text,
  },
  reviewHint: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  lastWordOwner: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
  },
  standings: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gold + '25',
  },
  standingsTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  standingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  standingPos: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    width: 24,
  },
  standingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  standingName: {
    flex: 1,
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  standingScore: {
    fontSize: SIZES.lg,
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
    paddingTop: 10,
  },
  nextButtonWrap: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  nextButtonText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: '#FFF',
  },
});
