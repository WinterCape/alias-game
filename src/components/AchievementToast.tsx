import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAchievements } from '../achievements/AchievementContext';
import { ACHIEVEMENTS } from '../achievements/definitions';
import { useI18n } from '../i18n/I18nContext';

const UNLOCKED_LABEL: Record<string, string> = {
  ro: 'Realizare deblocata!',
  en: 'Achievement Unlocked!',
  es: 'Logro desbloqueado!',
  fr: 'Succes debloque!',
  ru: 'Достижение разблокировано!',
};

export const AchievementToast = () => {
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements();
  const { lang } = useI18n();
  const translateY = useRef(new Animated.Value(-120)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showing, setShowing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queueRef = useRef(newlyUnlocked);

  // Keep queue ref in sync
  useEffect(() => {
    queueRef.current = newlyUnlocked;
  }, [newlyUnlocked]);

  // Start showing when new items arrive
  useEffect(() => {
    if (newlyUnlocked.length > 0 && !showing) {
      setCurrentIndex(0);
      setShowing(true);
    }
  }, [newlyUnlocked, showing]);

  // Animate the current toast
  useEffect(() => {
    if (!showing) return;

    if (currentIndex >= queueRef.current.length) {
      // All shown
      setShowing(false);
      clearNewlyUnlocked();
      return;
    }

    // Reset position and slide in
    translateY.setValue(-120);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();

    // Auto-dismiss after 3 seconds
    timerRef.current = setTimeout(() => {
      Animated.spring(translateY, {
        toValue: -120,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start(() => {
        setCurrentIndex((prev) => prev + 1);
      });
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showing, currentIndex, translateY, clearNewlyUnlocked]);

  if (!showing || currentIndex >= newlyUnlocked.length) return null;

  const achievementId = newlyUnlocked[currentIndex];
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) return null;

  const name =
    achievement.name[lang as keyof typeof achievement.name] || achievement.name.en;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name={achievement.icon as any}
          size={22}
          color={COLORS.gold}
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>
          {UNLOCKED_LABEL[lang] || UNLOCKED_LABEL.en}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.95)',
    borderRadius: SIZES.radius,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bodyBold,
    color: COLORS.ink,
    opacity: 0.7,
  },
  name: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: COLORS.ink,
    marginTop: 1,
  },
});
