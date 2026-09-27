import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useI18n } from '../i18n/I18nContext';
import { generateFunnyTeamNames } from '../utils/funnyNames';

const TEAM_ICONS: Array<'shield' | 'bird' | 'paw' | 'feather'> = [
  'shield',
  'bird',
  'paw',
  'feather',
];

export const TeamSetupScreen = ({ navigation }: any) => {
  const { settings, initializeTeams } = useGame();
  const { lang, t } = useI18n();
  const [teamNames, setTeamNames] = useState<string[]>(
    generateFunnyTeamNames(settings.numberOfTeams, lang)
  );

  const handleShuffle = () => {
    setTeamNames(generateFunnyTeamNames(settings.numberOfTeams, lang));
  };

  const handleStart = () => {
    initializeTeams(teamNames);
    navigation.navigate('Game');
  };

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.guilds}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>{t.chooseGuildNames}</Text>
          <TouchableOpacity
            style={styles.shuffleBtn}
            onPress={handleShuffle}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="dice-multiple" size={18} color={COLORS.gold} />
            <Text style={styles.shuffleText}>{t.shuffleNames}</Text>
          </TouchableOpacity>
        </View>

        {teamNames.map((name, index) => {
          const teamColor = COLORS.teamColors[index] || COLORS.gold;
          return (
            <View
              key={index}
              style={[
                styles.teamCard,
                { borderColor: teamColor + '60' },
              ]}
            >
              <View style={[styles.teamIcon, { backgroundColor: teamColor + '20' }]}>
                <MaterialCommunityIcons
                  name={TEAM_ICONS[index] || 'shield'}
                  size={28}
                  color={teamColor}
                />
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  const newNames = [...teamNames];
                  newNames[index] = text;
                  setTeamNames(newNames);
                }}
                placeholderTextColor={COLORS.textSecondary}
                selectionColor={teamColor}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="sword-cross" size={28} color={COLORS.parchment} />
          <Text style={styles.startButtonText}>{t.startAdventure}</Text>
        </TouchableOpacity>
      </View>
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
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.gold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
  },
  shuffleText: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.sm,
    color: COLORS.gold,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.cardRadius,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  teamIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: SIZES.lg,
    color: COLORS.text,
    fontFamily: FONTS.display,
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    paddingTop: 10,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.correct,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    elevation: 8,
    shadowColor: COLORS.correctGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.parchment,
  },
});
