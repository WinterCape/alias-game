import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useStats, GameRecord } from '../hooks/useStats';

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const GameHistoryItem = ({ game, index }: { game: GameRecord; index: number }) => {
  const date = new Date(game.date);
  const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <View style={styles.historyIndexWrap}>
          <Text style={styles.historyIndex}>#{index + 1}</Text>
        </View>
        <View>
          <View style={styles.historyWinnerRow}>
            <MaterialCommunityIcons name="crown" size={14} color={COLORS.gold} />
            <Text style={styles.historyWinner}>{game.winner}</Text>
            <Text style={styles.historyWinnerScore}>{game.winnerScore}p</Text>
          </View>
          <Text style={styles.historyDate}>{dateStr}</Text>
        </View>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyDetail}>
          <Text style={{ color: COLORS.correct }}>{game.totalWordsGuessed}</Text>
          {' / '}
          <Text style={{ color: COLORS.skip }}>{game.totalWordsSkipped}</Text>
        </Text>
        <Text style={styles.historyRounds}>{game.totalRounds} misiuni</Text>
      </View>
    </View>
  );
};

export const StatsScreen = ({ navigation }: any) => {
  const { stats, resetStats } = useStats();
  const [tab, setTab] = useState<'overview' | 'history' | 'leaders'>('overview');

  const handleReset = () => {
    Alert.alert(
      'Sterge Cronicile',
      'Ești sigur că vrei să ștergi toate cronicile? Această acțiune nu poate fi anulată.',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: resetStats,
        },
      ]
    );
  };

  const sortedWins = Object.entries(stats.winsByTeam)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const guessRate =
    stats.totalWordsGuessed + stats.totalWordsSkipped > 0
      ? Math.round(
          (stats.totalWordsGuessed /
            (stats.totalWordsGuessed + stats.totalWordsSkipped)) *
            100
        )
      : 0;

  const tabConfig = [
    { key: 'overview' as const, label: 'Rezumat', icon: 'book-open-variant' },
    { key: 'history' as const, label: 'Bătălii', icon: 'sword-cross' },
    { key: 'leaders' as const, label: 'Sala Faimei', icon: 'trophy' },
  ];

  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>Cronici</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabConfig.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={t.icon as any}
              size={14}
              color={tab === t.key ? COLORS.gold : COLORS.textSecondary}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'overview' && (
          <>
            <View style={styles.statGrid}>
              <StatCard
                icon="sword"
                label="Aventuri"
                value={stats.gamesPlayed}
                color={COLORS.gold}
              />
              <StatCard
                icon="shield-check"
                label="Cucerite"
                value={stats.totalWordsGuessed}
                color={COLORS.correct}
              />
              <StatCard
                icon="shield-off"
                label="Retrase"
                value={stats.totalWordsSkipped}
                color={COLORS.skip}
              />
              <StatCard
                icon="map-marker-path"
                label="Misiuni"
                value={stats.totalRoundsPlayed}
                color={COLORS.warning}
              />
              <StatCard
                icon="trending-up"
                label="Media / Misiune"
                value={stats.averageWordsPerRound}
                color={COLORS.goldBright}
              />
              <StatCard
                icon="percent"
                label="Rata Cucerire"
                value={`${guessRate}%`}
                color={COLORS.correctGlow}
              />
            </View>

            {stats.bestRoundScore > 0 && (
              <View style={styles.bestRound}>
                <View style={styles.bestRoundIconWrap}>
                  <MaterialCommunityIcons name="star-four-points" size={26} color={COLORS.goldBright} />
                </View>
                <View style={styles.bestRoundText}>
                  <Text style={styles.bestRoundTitle}>Cea Mai Glorioasă Misiune</Text>
                  <Text style={styles.bestRoundValue}>
                    {stats.bestRoundScore} puncte
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {tab === 'history' && (
          <>
            {stats.recentGames.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="script-text-outline"
                  size={64}
                  color={COLORS.goldDim}
                />
                <Text style={styles.emptyText}>Nicio aventură încă</Text>
                <Text style={styles.emptySubtext}>
                  Pornește prima aventură pentru a scrie cronicile
                </Text>
              </View>
            ) : (
              stats.recentGames.map((game, i) => (
                <GameHistoryItem key={i} game={game} index={i} />
              ))
            )}
          </>
        )}

        {tab === 'leaders' && (
          <>
            {sortedWins.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="sword-cross"
                  size={64}
                  color={COLORS.goldDim}
                />
                <Text style={styles.emptyText}>Niciun campion încă</Text>
                <Text style={styles.emptySubtext}>
                  Termină o aventură pentru a intra în Sala Faimei
                </Text>
              </View>
            ) : (
              sortedWins.map(([name, wins], i) => (
                <View key={name} style={[styles.leaderItem, i === 0 && styles.leaderItemFirst]}>
                  <View style={styles.leaderLeft}>
                    {i === 0 && (
                      <View style={styles.leaderMedalWrap}>
                        <MaterialCommunityIcons name="trophy" size={24} color={COLORS.goldBright} />
                      </View>
                    )}
                    {i === 1 && (
                      <View style={styles.leaderMedalWrap}>
                        <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />
                      </View>
                    )}
                    {i === 2 && (
                      <View style={styles.leaderMedalWrap}>
                        <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />
                      </View>
                    )}
                    {i > 2 && <Text style={styles.leaderIndex}>{i + 1}</Text>}
                    <Text style={[styles.leaderName, i === 0 && styles.leaderNameFirst]}>
                      {name}
                    </Text>
                  </View>
                  <View style={styles.leaderRight}>
                    <Text style={styles.leaderWins}>{wins}</Text>
                    <Text style={styles.leaderWinsLabel}>
                      {wins === 1 ? 'victorie' : 'victorii'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
    letterSpacing: 1,
  },

  /* ---------- Tabs ---------- */
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.radius,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.08)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius - 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'rgba(212,168,83,0.10)',
    borderColor: COLORS.gold,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.gold,
  },

  /* ---------- Scroll ---------- */
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },

  /* ---------- Stat grid ---------- */
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.10)',
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* ---------- Best round ---------- */
  bestRound: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.06)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.20)',
  },
  bestRoundIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestRoundText: {
    flex: 1,
  },
  bestRoundTitle: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
  bestRoundValue: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.goldBright,
    marginTop: 2,
  },

  /* ---------- Empty state ---------- */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.display,
    color: COLORS.parchment,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  /* ---------- History items ---------- */
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(242,228,201,0.05)',
    borderRadius: SIZES.cardRadius,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(242,228,201,0.10)',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIndexWrap: {
    width: 30,
    alignItems: 'center',
  },
  historyIndex: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.goldDim,
  },
  historyWinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyWinner: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.parchment,
  },
  historyWinnerScore: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  historyDate: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDetail: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
  },
  historyRounds: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* ---------- Leader items ---------- */
  leaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.10)',
  },
  leaderItemFirst: {
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderColor: 'rgba(212,168,83,0.25)',
  },
  leaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderMedalWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212,168,83,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderIndex: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBlack,
    color: COLORS.textSecondary,
    width: 32,
    textAlign: 'center',
  },
  leaderName: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.parchment,
  },
  leaderNameFirst: {
    fontFamily: FONTS.display,
    color: COLORS.goldBright,
  },
  leaderRight: {
    alignItems: 'flex-end',
  },
  leaderWins: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
  },
  leaderWinsLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },
});
