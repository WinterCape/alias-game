import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useProgression } from '../progression/ProgressionContext';
import { getRankForLevel } from '../progression/ranks';
import { useI18n } from '../i18n/I18nContext';
import { getRewardsForLevel } from '../progression/rewards';

const LEVEL_UP_LABEL: Record<string, string> = {
  ro: 'NIVEL NOU!',
  en: 'LEVEL UP!',
  es: 'SUBIDA DE NIVEL!',
  fr: 'NIVEAU SUPERIEUR!',
  ru: 'НОВЫЙ УРОВЕНЬ!',
};

export const LevelUpToast = () => {
  const { didLevelUp, level, clearLevelUp } = useProgression();
  const { lang } = useI18n();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!didLevelUp) return;

    // Animate in: scale from 0 to 1 with spring
    scale.setValue(0);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 4 seconds
    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        clearLevelUp();
      });
    }, 4000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [didLevelUp, scale, opacity, clearLevelUp]);

  if (!didLevelUp) return null;

  const rank = getRankForLevel(level);
  const rewards = getRewardsForLevel(level);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
      pointerEvents="none"
    >
      {/* Glowing icon circle */}
      <View style={styles.iconGlow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={rank.icon as any}
            size={28}
            color={COLORS.gold}
          />
        </View>
      </View>

      {/* Level up text */}
      <Text style={styles.levelUpText}>
        {LEVEL_UP_LABEL[lang] || LEVEL_UP_LABEL.en}
      </Text>

      {/* New rank name */}
      <Text style={styles.rankName}>{rank.name[lang]}</Text>

      {/* Level number */}
      <Text style={styles.levelNumber}>Level {level}</Text>

      {/* Reward line(s) */}
      {rewards.map((reward) => (
        <View key={reward.value} style={styles.rewardRow}>
          <MaterialCommunityIcons
            name={reward.icon as any}
            size={16}
            color={COLORS.goldBright}
          />
          <Text style={styles.rewardText}>{reward.name[lang]}</Text>
        </View>
      ))}

      {/* XP sparkle */}
      <Text style={styles.sparkle}>&#10022; +XP &#10022;</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    left: 40,
    right: 40,
    zIndex: 1000,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: SIZES.radius + 4,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  iconGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212,168,83,0.2)',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUpText: {
    fontFamily: FONTS.displayBlack,
    fontSize: 28,
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 6,
  },
  rankName: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.gold,
    marginBottom: 4,
  },
  levelNumber: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rewardText: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.sm,
    color: COLORS.goldBright,
  },
  sparkle: {
    fontFamily: FONTS.body,
    fontSize: SIZES.sm,
    color: COLORS.goldDim,
    letterSpacing: 2,
    marginTop: 2,
  },
});
