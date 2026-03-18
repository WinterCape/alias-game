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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';

export const RoundResultScreen = ({ route, navigation }: any) => {
  const { result } = route.params;
  const { teams } = useGame();
  const team = teams[result.teamId];

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Rezultat Rundă</Text>
        <Text style={[styles.teamName, { color: team?.color }]}>{team?.name}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={[styles.scoreBadge, { borderColor: team?.color }]}>
          <Text style={[styles.scoreValue, { color: team?.color }]}>
            {result.score > 0 ? '+' : ''}{result.score}
          </Text>
          <Text style={styles.scoreLabel}>puncte</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.correct} />
            <Text style={styles.statValue}>{result.guessedWords.length}</Text>
            <Text style={styles.statLabel}>Ghicite</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="skip-next-circle" size={24} color={COLORS.skip} />
            <Text style={styles.statValue}>{result.skippedWords.length}</Text>
            <Text style={styles.statLabel}>Sărite</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.wordList} showsVerticalScrollIndicator={false}>
        {result.guessedWords.length > 0 && (
          <View style={styles.wordSection}>
            <Text style={styles.wordSectionTitle}>Cuvinte Ghicite</Text>
            {result.guessedWords.map((word: string, i: number) => (
              <View key={i} style={styles.wordItem}>
                <MaterialCommunityIcons name="check" size={18} color={COLORS.correct} />
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
        )}

        {result.skippedWords.length > 0 && (
          <View style={styles.wordSection}>
            <Text style={styles.wordSectionTitle}>Cuvinte Sărite</Text>
            {result.skippedWords.map((word: string, i: number) => (
              <View key={i} style={styles.wordItem}>
                <MaterialCommunityIcons name="close" size={18} color={COLORS.skip} />
                <Text style={[styles.wordText, { color: COLORS.textSecondary }]}>{word}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Current Standings */}
      <View style={styles.standings}>
        <Text style={styles.standingsTitle}>Clasament</Text>
        {[...teams].sort((a, b) => b.score - a.score).map((t, i) => (
          <View key={t.id} style={styles.standingItem}>
            <Text style={styles.standingPos}>{i + 1}.</Text>
            <View style={[styles.standingDot, { backgroundColor: t.color }]} />
            <Text style={styles.standingName}>{t.name}</Text>
            <Text style={[styles.standingScore, { color: t.color }]}>{t.score}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.replace('Game')}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Runda Următoare</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
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
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  teamName: {
    fontSize: SIZES.xxl,
    fontWeight: '900',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: SIZES.xxxl,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: SIZES.xs,
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
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  wordText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  standings: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
  },
  standingsTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  standingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  standingPos: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '700',
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
    color: COLORS.text,
    fontWeight: '600',
  },
  standingScore: {
    fontSize: SIZES.lg,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
  },
  nextButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
});
