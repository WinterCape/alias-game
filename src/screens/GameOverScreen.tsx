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
import { COLORS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';

export const GameOverScreen = ({ route, navigation }: any) => {
  const { resetGame } = useGame();
  const { teams } = route.params;

  const sorted = [...teams].sort((a: any, b: any) => b.score - a.score);
  const winner = sorted[0];

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.winnerSection, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialCommunityIcons name="trophy" size={80} color="#FFD700" />
        <Text style={styles.congratsText}>Felicitări!</Text>
        <Text style={[styles.winnerName, { color: winner.color }]}>
          {winner.name}
        </Text>
        <Text style={styles.winnerScore}>{winner.score} puncte</Text>
      </Animated.View>

      <Animated.View style={[styles.standings, { opacity: fadeAnim }]}>
        <Text style={styles.standingsTitle}>Clasament Final</Text>
        {sorted.map((team: any, index: number) => (
          <View key={team.id} style={styles.standingRow}>
            <View style={styles.standingLeft}>
              {index === 0 && (
                <MaterialCommunityIcons name="trophy" size={20} color="#FFD700" />
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
              {team.score}
            </Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="restart" size={24} color="#FFF" />
          <Text style={styles.newGameText}>Joc Nou</Text>
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
  congratsText: {
    fontSize: SIZES.xl,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 16,
  },
  winnerName: {
    fontSize: 40,
    fontWeight: '900',
    marginTop: 8,
  },
  winnerScore: {
    fontSize: SIZES.xl,
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 4,
  },
  standings: {
    marginHorizontal: SIZES.padding,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  standingsTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  standingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  standingIndex: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '700',
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
    color: COLORS.text,
    fontWeight: '600',
  },
  standingScore: {
    fontSize: SIZES.xl,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: 30,
  },
  newGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  newGameText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
});
