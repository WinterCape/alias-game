import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { Player, QuestTurn } from '../types';

export const QuestScoresScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const { players, turnHistory }: { players: Player[]; turnHistory: QuestTurn[] } = route.params;

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Stats
  const totalTurns = turnHistory.length;
  const totalCorrect = turnHistory.filter((t) => !t.skipped).length;
  const totalSkips = turnHistory.filter((t) => t.skipped).length;

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

  const handleNewGame = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner Section */}
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

        {/* Rankings */}
        <Animated.View style={[styles.standings, { opacity: fadeAnim }]}>
          <Text style={styles.standingsTitle}>{t.hallOfFame}</Text>
          {sorted.map((player, index) => (
            <View key={player.id} style={styles.standingRow}>
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
                <View style={[styles.standingDot, { backgroundColor: player.color }]} />
                <Text style={styles.standingName} numberOfLines={1}>{player.name}</Text>
              </View>
              <Text style={[styles.standingScore, { color: player.color }]}>
                {player.score} <Text style={styles.standingExp}>{t.exp}</Text>
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <Text style={styles.statsTitle}>{t.questScores}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="sword-cross" size={24} color={COLORS.gold} />
              <Text style={styles.statValue}>{totalTurns}</Text>
              <Text style={styles.statLabel}>{t.rounds}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.correctGlow} />
              <Text style={[styles.statValue, { color: COLORS.correctGlow }]}>{totalCorrect}</Text>
              <Text style={styles.statLabel}>{t.conquered}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="close-circle" size={24} color={COLORS.skipGlow} />
              <Text style={[styles.statValue, { color: COLORS.skipGlow }]}>{totalSkips}</Text>
              <Text style={styles.statLabel}>{t.retreated}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 20,
  },

  /* --- Winner --- */
  winnerSection: {
    alignItems: 'center',
    marginBottom: 32,
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

  /* --- Rankings --- */
  standings: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.gold + '25',
    marginBottom: 16,
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
    flex: 1,
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
    flex: 1,
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

  /* --- Stats --- */
  statsSection: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.gold + '25',
  },
  statsTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.gold + '20',
  },

  /* --- Footer --- */
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: 16,
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
