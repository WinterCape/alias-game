import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { Language } from '../i18n/strings';
import { ProfileCard } from '../components/ProfileCard';
import { useGame } from '../hooks/GameContext';
import { getRoundNumber } from '../hooks/arenaSession';

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'ro', label: 'RO', flag: '🇷🇴' },
  { id: 'en', label: 'EN', flag: '🇬🇧' },
  { id: 'es', label: 'ES', flag: '🇪🇸' },
  { id: 'fr', label: 'FR', flag: '🇫🇷' },
  { id: 'ru', label: 'RU', flag: '🇷🇺' },
];

export const HomeScreen = ({ navigation }: any) => {
  const { lang, t, setLanguage } = useI18n();
  const insets = useSafeAreaInsets();
  const { savedGame, resumeGame, clearSavedGame } = useGame();

  const handleContinue = () => {
    if (!savedGame) return;
    resumeGame(savedGame);
    navigation.navigate('Game');
  };

  // Starting a new Arena game replaces the saved one, so ask first
  const handleArena = () => {
    if (!savedGame) {
      navigation.navigate('Settings');
      return;
    }
    Alert.alert(t.newGameConfirmTitle, t.newGameConfirmMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.newGameConfirm,
        style: 'destructive',
        onPress: () => {
          clearSavedGame();
          navigation.navigate('Settings');
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={COLORS.gradientTable} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.profileWrap}>
          <ProfileCard />
        </View>

        <View style={styles.buttonContainer}>
          {/* Unfinished Arena game */}
          {savedGame && (
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="play-circle" size={28} color={COLORS.gold} />
              <View style={styles.modeBtnContent}>
                <Text style={styles.continueTitle}>{t.continueBattle}</Text>
                <Text style={styles.continueDesc} numberOfLines={1}>
                  {savedGame.teams.map((team) => `${team.name} ${team.score}`).join(' · ')}
                </Text>
              </View>
              <Text style={styles.continueMeta}>
                {t.roundLabel} {getRoundNumber(savedGame.roundResults.length, savedGame.teams.length)}
              </Text>
            </TouchableOpacity>
          )}

          {/* Arena Mode */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleArena}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B6914', '#D4A853', '#8B6914']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              <MaterialCommunityIcons name="sword-cross" size={22} color={COLORS.ink} />
              <View style={styles.modeBtnContent}>
                <Text style={styles.primaryBtnText}>{t.arenaMode}</Text>
                <Text style={[styles.modeDesc, { color: COLORS.inkSoft }]}>{t.arenaDesc}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Quest Mode */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('QuestSettings')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2B7AAD', '#4EA8DE', '#2B7AAD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#FFF" />
              <View style={styles.modeBtnContent}>
                <Text style={[styles.primaryBtnText, { color: '#FFF' }]}>{t.questMode}</Text>
                <Text style={[styles.modeDesc, { color: 'rgba(255,255,255,0.6)' }]}>{t.questDesc}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="treasure-chest" size={20} color={COLORS.gold} />
            <Text style={styles.secondaryBtnText}>{t.heroShop}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Achievements')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="medal" size={20} color={COLORS.gold} />
            <Text style={styles.secondaryBtnText}>{lang === 'ro' ? 'Realizări' : lang === 'es' ? 'Logros' : lang === 'fr' ? 'Succès' : lang === 'ru' ? 'Достижения' : 'Achievements'}</Text>
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    fontSize: 14,
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
    marginBottom: 24,
  },
  shield: {
    width: 100,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shieldInner: {
    width: 92,
    height: 100,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 8,
    borderBottomLeftRadius: 46,
    borderBottomRightRadius: 46,
    backgroundColor: 'rgba(212,168,83,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldGlow: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'rgba(212,168,83,0.05)',
    zIndex: -1,
  },
  shieldLetter: {
    fontFamily: FONTS.displayBlack,
    fontSize: 54,
    color: COLORS.gold,
    marginTop: -4,
  },
  title: {
    fontFamily: FONTS.displayBlack,
    fontSize: 46,
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
    marginTop: 14,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.goldDim,
    opacity: 0.4,
  },
  profileWrap: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 14,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 420,
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
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
  },
  modeBtnContent: {
    flex: 1,
  },
  modeDesc: {
    fontFamily: FONTS.body,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  primaryBtnText: {
    fontFamily: FONTS.bodyBlack,
    fontSize: 16,
    color: COLORS.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212,168,83,0.1)',
  },
  continueTitle: {
    fontFamily: FONTS.bodyBlack,
    fontSize: 15,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  continueDesc: {
    fontFamily: FONTS.body,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  continueMeta: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
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
    marginTop: 16,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    opacity: 0.4,
  },
});
