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

export const GameOverScreen = ({ route, navigation }: any) => {
  const { resetGame, roundResults } = useGame();
  const { recordGame } = useStats();
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
        <Text style={styles.congratsText}>Felicitari, Campion!</Text>
        <Text style={[styles.winnerName, { color: winner.color }]}>
          {winner.name}
        </Text>
        <Text style={styles.winnerScore}>
          {winner.score} <Text style={styles.winnerExp}>exp</Text>
        </Text>
      </Animated.View>

      <Animated.View style={[styles.standings, { opacity: fadeAnim }]}>
        <Text style={styles.standingsTitle}>Sala Faimei</Text>
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
              {team.score} <Text style={styles.standingExp}>exp</Text>
            </Text>
          </View>
        ))}
      </Animated.View>

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
            <Text style={styles.newGameText}>Aventura Noua</Text>
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
