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
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAchievements } from '../achievements/AchievementContext';
import { ACHIEVEMENTS, AchievementId } from '../achievements/definitions';
import { useI18n } from '../i18n/I18nContext';

const TITLE: Record<string, string> = {
  ro: 'Realizari',
  en: 'Achievements',
  es: 'Logros',
  fr: 'Succes',
  ru: 'Достижения',
};

const SECRET_LABEL: Record<string, string> = {
  ro: 'Realizare secreta',
  en: 'Secret achievement',
  es: 'Logro secreto',
  fr: 'Succes secret',
  ru: 'Секретное достижение',
};

const UNLOCKED_LABEL: Record<string, string> = {
  ro: 'Deblocat',
  en: 'Unlocked',
  es: 'Desbloqueado',
  fr: 'Debloqué',
  ru: 'Разблокировано',
};

const AchievementCard = ({
  achievement,
  unlocked,
  unlockDate,
  lang,
}: {
  achievement: (typeof ACHIEVEMENTS)[number];
  unlocked: boolean;
  unlockDate: string | undefined;
  lang: string;
}) => {
  const isSecret = achievement.secret && !unlocked;

  const formattedDate = unlockDate
    ? (() => {
        const d = new Date(unlockDate);
        return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${d.getFullYear()}`;
      })()
    : null;

  if (isSecret) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, styles.iconCircleLocked]}>
            <MaterialCommunityIcons name="lock" size={22} color={COLORS.textSecondary} />
          </View>
        </View>
        <View style={styles.cardCenter}>
          <Text style={styles.cardNameLocked}>???</Text>
          <Text style={styles.cardDescLocked}>
            {SECRET_LABEL[lang] || SECRET_LABEL.en}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} />
        </View>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, styles.iconCircleLocked]}>
            <MaterialCommunityIcons name="lock" size={22} color={COLORS.textSecondary} />
          </View>
        </View>
        <View style={styles.cardCenter}>
          <Text style={styles.cardNameLocked}>
            {achievement.name[lang as keyof typeof achievement.name] || achievement.name.en}
          </Text>
          <Text style={styles.cardDescLocked}>
            {achievement.description[lang as keyof typeof achievement.description] ||
              achievement.description.en}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.cardUnlocked]}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconCircle, styles.iconCircleUnlocked]}>
          <MaterialCommunityIcons
            name={achievement.icon as any}
            size={22}
            color={COLORS.gold}
          />
        </View>
      </View>
      <View style={styles.cardCenter}>
        <Text style={styles.cardNameUnlocked}>
          {achievement.name[lang as keyof typeof achievement.name] || achievement.name.en}
        </Text>
        <Text style={styles.cardDescUnlocked}>
          {achievement.description[lang as keyof typeof achievement.description] ||
            achievement.description.en}
        </Text>
        {formattedDate && (
          <Text style={styles.cardDate}>
            {UNLOCKED_LABEL[lang] || UNLOCKED_LABEL.en} {formattedDate}
          </Text>
        )}
      </View>
      <View style={styles.cardRight}>
        <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.gold} />
      </View>
    </View>
  );
};

export const AchievementsScreen = ({ navigation }: any) => {
  const { isUnlocked, unlockedCount, totalCount, state } = useAchievements();
  const { lang } = useI18n();

  const progress = totalCount > 0 ? unlockedCount / totalCount : 0;

  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{TITLE[lang] || TITLE.en}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unlockedCount}/{totalCount}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Achievement list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={isUnlocked(achievement.id)}
            unlockDate={state.unlocked[achievement.id]}
            lang={lang}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* ---------- Header ---------- */
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
  title: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
  },
  badgeText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
  },

  /* ---------- Progress bar ---------- */
  progressContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },

  /* ---------- Scroll ---------- */
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
    gap: 10,
  },

  /* ---------- Card shared ---------- */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    padding: 14,
    borderWidth: 1,
  },
  cardLeft: {
    marginRight: 12,
  },
  cardCenter: {
    flex: 1,
  },
  cardRight: {
    marginLeft: 12,
  },

  /* ---------- Icon circle ---------- */
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleUnlocked: {
    backgroundColor: 'rgba(212,168,83,0.15)',
  },
  iconCircleLocked: {
    backgroundColor: 'rgba(168,155,128,0.10)',
  },

  /* ---------- Card unlocked ---------- */
  cardUnlocked: {
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderColor: 'rgba(212,168,83,0.25)',
  },
  cardNameUnlocked: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.display,
    color: COLORS.gold,
  },
  cardDescUnlocked: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardDate: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.body,
    color: COLORS.goldDim,
    marginTop: 4,
  },

  /* ---------- Card locked ---------- */
  cardLocked: {
    backgroundColor: 'rgba(168,155,128,0.04)',
    borderColor: 'rgba(168,155,128,0.10)',
    opacity: 0.6,
  },
  cardNameLocked: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.display,
    color: COLORS.textSecondary,
  },
  cardDescLocked: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
