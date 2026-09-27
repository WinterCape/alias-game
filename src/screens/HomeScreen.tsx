import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/strings';

const { width } = Dimensions.get('window');

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'ro', label: 'RO', flag: '🇷🇴' },
  { id: 'en', label: 'EN', flag: '🇬🇧' },
];

export const HomeScreen = ({ navigation }: any) => {
  const { lang, t, setLanguage } = useI18n();

  return (
    <LinearGradient colors={COLORS.gradientTable} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Language Picker */}
      <View style={styles.langRow}>
        {LANGUAGES.map((l) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.langBtn, lang === l.id && styles.langBtnActive]}
            onPress={() => setLanguage(l.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <Text style={[styles.langLabel, lang === l.id && styles.langLabelActive]}>
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.header}>
        <View style={styles.shield}>
          <View style={styles.shieldInner}>
            <Text style={styles.shieldLetter}>A</Text>
          </View>
          <View style={styles.shieldGlow} />
        </View>

        <Text style={styles.title}>ALIAS</Text>
        <Text style={styles.subtitle}>QUEST</Text>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <MaterialCommunityIcons name="cards-playing-outline" size={20} color={COLORS.goldDim} />
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B6914', '#D4A853', '#8B6914']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGradient}
          >
            <MaterialCommunityIcons name="sword-cross" size={22} color={COLORS.ink} />
            <Text style={styles.primaryBtnText}>{t.newAdventure}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Shop')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="treasure-chest" size={20} color={COLORS.gold} />
          <Text style={styles.secondaryBtnText}>{lang === 'ro' ? 'Magazinul Eroilor' : "Hero's Shop"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Rules')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="script-text" size={20} color={COLORS.gold} />
          <Text style={styles.secondaryBtnText}>{t.heroCode}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Stats')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="trophy-variant" size={20} color={COLORS.gold} />
          <Text style={styles.secondaryBtnText}>{t.chronicles}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>v1.0.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  langRow: {
    position: 'absolute',
    top: 56,
    right: SIZES.padding,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.12)',
  },
  langBtnActive: {
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderColor: COLORS.gold,
  },
  langFlag: {
    fontSize: 16,
  },
  langLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  langLabelActive: {
    color: COLORS.gold,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  shield: {
    width: 120,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shieldInner: {
    width: 110,
    height: 120,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 8,
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    backgroundColor: 'rgba(212,168,83,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(212,168,83,0.05)',
    zIndex: -1,
  },
  shieldLetter: {
    fontFamily: FONTS.displayBlack,
    fontSize: 64,
    color: COLORS.gold,
    marginTop: -4,
  },
  title: {
    fontFamily: FONTS.displayBlack,
    fontSize: 52,
    color: COLORS.gold,
    letterSpacing: 10,
  },
  subtitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.textSecondary,
    letterSpacing: 16,
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.goldDim,
    opacity: 0.4,
  },
  buttonContainer: {
    width: width * 0.78,
    gap: 12,
  },
  primaryBtn: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
  },
  primaryBtnText: {
    fontFamily: FONTS.bodyBlack,
    fontSize: 16,
    color: COLORS.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    backgroundColor: 'rgba(212,168,83,0.04)',
  },
  secondaryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    opacity: 0.4,
  },
});
