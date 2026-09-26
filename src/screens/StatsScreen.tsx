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
import { COLORS, SIZES } from '../constants/theme';
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
    <View style={[styles.statIconWrap, { backgroundColor: color + '20' }]}>
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
        <Text style={styles.historyIndex}>#{index + 1}</Text>
        <View>
          <View style={styles.historyWinnerRow}>
            <MaterialCommunityIcons name="trophy" size={14} color="#FFD700" />
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
        <Text style={styles.historyRounds}>{game.totalRounds} runde</Text>
      </View>
    </View>
  );
};

export const StatsScreen = ({ navigation }: any) => {
  const { stats, resetStats } = useStats();
  const [tab, setTab] = useState<'overview' | 'history' | 'leaders'>('overview');

  const handleReset = () => {
    Alert.alert(
      'Resetare Statistici',
      'Ești sigur că vrei să ștergi toate statisticile? Această acțiune nu poate fi anulată.',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Resetează',
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

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Statistici</Text>
        <TouchableOpacity onPress={handleReset} style={styles.backBtn}>
          <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['overview', 'history', 'leaders'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'overview' ? 'Sumar' : t === 'history' ? 'Istoric' : 'Clasament'}
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
                icon="gamepad-variant"
                label="Jocuri"
                value={stats.gamesPlayed}
                color={COLORS.primary}
              />
              <StatCard
                icon="check-circle"
                label="Ghicite"
                value={stats.totalWordsGuessed}
                color={COLORS.correct}
              />
              <StatCard
                icon="skip-next-circle"
                label="Sărite"
                value={stats.totalWordsSkipped}
                color={COLORS.skip}
              />
              <StatCard
                icon="timer"
                label="Runde"
                value={stats.totalRoundsPlayed}
                color={COLORS.warning}
              />
              <StatCard
                icon="trending-up"
                label="Media / Rundă"
                value={stats.averageWordsPerRound}
                color="#54A0FF"
              />
              <StatCard
                icon="percent"
                label="Rata Ghicit"
                value={`${guessRate}%`}
                color="#43E97B"
              />
            </View>

            {stats.bestRoundScore > 0 && (
              <View style={styles.bestRound}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                <View style={styles.bestRoundText}>
                  <Text style={styles.bestRoundTitle}>Cel Mai Bun Scor într-o Rundă</Text>
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
                  name="gamepad-variant-outline"
                  size={64}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.emptyText}>Niciun joc încă</Text>
                <Text style={styles.emptySubtext}>
                  Joacă primul joc pentru a vedea istoricul
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
                  name="trophy-outline"
                  size={64}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.emptyText}>Niciun câștigător încă</Text>
                <Text style={styles.emptySubtext}>
                  Termină un joc pentru a vedea clasamentul
                </Text>
              </View>
            ) : (
              sortedWins.map(([name, wins], i) => (
                <View key={name} style={styles.leaderItem}>
                  <View style={styles.leaderLeft}>
                    {i === 0 && (
                      <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
                    )}
                    {i === 1 && (
                      <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />
                    )}
                    {i === 2 && (
                      <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />
                    )}
                    {i > 2 && <Text style={styles.leaderIndex}>{i + 1}</Text>}
                    <Text style={styles.leaderName}>{name}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  bestRound: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderRadius: SIZES.radius,
    padding: 16,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  bestRoundText: {
    flex: 1,
  },
  bestRoundTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bestRoundValue: {
    fontSize: SIZES.xl,
    fontWeight: '900',
    color: '#FFD700',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIndex: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '700',
    width: 28,
  },
  historyWinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyWinner: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  historyWinnerScore: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  historyDate: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDetail: {
    fontSize: SIZES.md,
    fontWeight: '700',
  },
  historyRounds: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  leaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  leaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderIndex: {
    fontSize: SIZES.md,
    fontWeight: '800',
    color: COLORS.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  leaderName: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  leaderRight: {
    alignItems: 'flex-end',
  },
  leaderWins: {
    fontSize: SIZES.xl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  leaderWinsLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
});
