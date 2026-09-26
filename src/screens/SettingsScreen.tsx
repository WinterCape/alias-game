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
import { CATEGORIES } from '../data/categories';
import { ALL_CATEGORIES } from '../data/words';
import { useGame } from '../hooks/GameContext';
import { CategoryId, Difficulty } from '../types';

const ROUND_DURATIONS = [30, 45, 60, 90, 120];
const WINNING_SCORES = [25, 50, 75, 100];
const TEAM_COUNTS = [2, 3, 4];
const DIFFICULTIES: { id: Difficulty | 'all'; label: string; icon: string }[] = [
  { id: 'easy', label: 'Ușor', icon: 'shield-outline' },
  { id: 'medium', label: 'Mediu', icon: 'shield-half-full' },
  { id: 'hard', label: 'Greu', icon: 'shield' },
  { id: 'all', label: 'Toate', icon: 'sword-cross' },
];

export const SettingsScreen = ({ navigation }: any) => {
  const { settings, updateSettings } = useGame();

  const allSelected = settings.selectedCategories.length === ALL_CATEGORIES.length;

  const toggleAll = () => {
    if (allSelected) {
      updateSettings({ selectedCategories: [ALL_CATEGORIES[0]] });
    } else {
      updateSettings({ selectedCategories: [...ALL_CATEGORIES] });
    }
  };

  const toggleCategory = (id: CategoryId) => {
    const current = settings.selectedCategories;
    if (current.includes(id)) {
      if (current.length > 1) {
        updateSettings({ selectedCategories: current.filter((c) => c !== id) });
      }
    } else {
      updateSettings({ selectedCategories: [...current, id] });
    }
  };

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>Pregătire de Luptă</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Round Duration */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="timer-sand" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Durata Misiunii (secunde)</Text>
        </View>
        <View style={styles.optionRow}>
          {ROUND_DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.optionChip,
                settings.roundDuration === d && styles.optionChipActive,
              ]}
              onPress={() => updateSettings({ roundDuration: d })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.roundDuration === d && styles.optionTextActive,
                ]}
              >
                {d}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Winning Score */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="star-four-points" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Experiență pentru Victorie</Text>
        </View>
        <View style={styles.optionRow}>
          {WINNING_SCORES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.optionChip,
                settings.winningScore === s && styles.optionChipActive,
              ]}
              onPress={() => updateSettings({ winningScore: s })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.winningScore === s && styles.optionTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Number of Teams */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-account" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Număr de Bresle</Text>
        </View>
        <View style={styles.optionRow}>
          {TEAM_COUNTS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[
                styles.optionChip,
                settings.numberOfTeams === n && styles.optionChipActive,
              ]}
              onPress={() => updateSettings({ numberOfTeams: n })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.numberOfTeams === n && styles.optionTextActive,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="sword" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Dificultate</Text>
        </View>
        <View style={styles.optionRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.optionChip,
                styles.difficultyChip,
                settings.difficulty === d.id && styles.optionChipActive,
              ]}
              onPress={() => updateSettings({ difficulty: d.id })}
            >
              <MaterialCommunityIcons
                name={d.icon as any}
                size={16}
                color={settings.difficulty === d.id ? COLORS.gold : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.optionText,
                  settings.difficulty === d.id && styles.optionTextActive,
                ]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip Penalty */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => updateSettings({ skipPenalty: !settings.skipPenalty })}
        >
          <View style={styles.toggleInfo}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="run-fast" size={18} color={COLORS.gold} />
              <Text style={styles.sectionTitle}>Penalizare la Retragere</Text>
            </View>
            <Text style={styles.toggleDesc}>-1 punct pentru fiecare cuvânt sărit</Text>
          </View>
          <View
            style={[
              styles.toggle,
              settings.skipPenalty && styles.toggleActive,
            ]}
          >
            <View
              style={[
                styles.toggleDot,
                settings.skipPenalty && styles.toggleDotActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="map-legend" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Tărâmuri</Text>
        </View>
        <View style={styles.categoryGrid}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              styles.allChip,
              allSelected && styles.allChipActive,
            ]}
            onPress={toggleAll}
          >
            <MaterialCommunityIcons
              name="earth"
              size={20}
              color={allSelected ? COLORS.goldBright : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.categoryText,
                allSelected && styles.allChipText,
              ]}
            >
              Toate
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => {
            const isSelected = settings.selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={20}
                  color={isSelected ? COLORS.goldBright : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('TeamSetup')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Înainte!</Text>
          <MaterialCommunityIcons name="sword" size={24} color={COLORS.ink} />
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
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.1)',
  },
  optionChipActive: {
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderColor: COLORS.gold,
  },
  optionText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: COLORS.gold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleDesc: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.goldBright,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.parchmentDark,
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.ink,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  difficultyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allChip: {
    borderStyle: 'dashed' as any,
    borderColor: 'rgba(212,168,83,0.25)',
  },
  allChipActive: {
    backgroundColor: 'rgba(212,168,83,0.2)',
    borderColor: COLORS.goldBright,
    borderStyle: 'solid' as any,
  },
  allChipText: {
    color: COLORS.goldBright,
    fontFamily: FONTS.bodyBlack,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.1)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(212,168,83,0.15)',
    borderColor: COLORS.gold,
  },
  categoryText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.goldBright,
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
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    elevation: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.displayBlack,
    color: COLORS.ink,
  },
});
