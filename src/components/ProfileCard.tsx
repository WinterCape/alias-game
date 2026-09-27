import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useProgression } from '../progression/ProgressionContext';
import { getRankForLevel } from '../progression/ranks';
import { useI18n } from '../i18n/I18nContext';

interface ProfileCardProps {
  onPress?: () => void;
}

export const ProfileCard = ({ onPress }: ProfileCardProps) => {
  const { totalXP, level, xpProgress } = useProgression();
  const { lang } = useI18n();
  const rank = getRankForLevel(level);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Rank icon */}
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name={rank.icon as any}
          size={22}
          color={COLORS.gold}
        />
      </View>

      {/* Center info */}
      <View style={styles.center}>
        <View style={styles.nameRow}>
          <Text style={styles.rankName} numberOfLines={1}>
            {rank.name[lang]}
          </Text>
          <Text style={styles.levelLabel}>Lv.{level}</Text>
        </View>

        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.min(xpProgress.progress * 100, 100)}%` },
            ]}
          />
        </View>

        <Text style={styles.xpLabel}>
          {xpProgress.current} / {xpProgress.needed} XP
        </Text>
      </View>

      {/* Total XP */}
      <Text style={styles.totalXP}>{totalXP}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.15)',
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderWidth: 1,
    borderColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  center: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  rankName: {
    fontFamily: FONTS.display,
    fontSize: SIZES.md,
    color: COLORS.gold,
  },
  levelLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(212,168,83,0.15)',
    overflow: 'hidden',
    marginBottom: 3,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  xpLabel: {
    fontFamily: FONTS.body,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  totalXP: {
    fontFamily: FONTS.bodyBlack,
    fontSize: SIZES.lg,
    color: COLORS.gold,
  },
});
