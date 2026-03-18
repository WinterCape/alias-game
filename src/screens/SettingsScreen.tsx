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
import { COLORS, SIZES } from '../constants/theme';
import { CATEGORIES } from '../data/categories';
import { useGame } from '../hooks/GameContext';
import { CategoryId } from '../types';

const ROUND_DURATIONS = [30, 45, 60, 90, 120];
const WINNING_SCORES = [25, 50, 75, 100];
const TEAM_COUNTS = [2, 3, 4];

export const SettingsScreen = ({ navigation }: any) => {
  const { settings, updateSettings } = useGame();

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
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Setări Joc</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Round Duration */}
        <Text style={styles.sectionTitle}>Durata Rundei (secunde)</Text>
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
        <Text style={styles.sectionTitle}>Scor pentru Victorie</Text>
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
        <Text style={styles.sectionTitle}>Număr de Echipe</Text>
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

        {/* Skip Penalty */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => updateSettings({ skipPenalty: !settings.skipPenalty })}
        >
          <View>
            <Text style={styles.sectionTitle}>Penalizare la Skip</Text>
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
        <Text style={styles.sectionTitle}>Categorii</Text>
        <Text style={styles.toggleDesc}>
          Selectează cel puțin o categorie
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = settings.selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  isSelected && { backgroundColor: cat.color + '30', borderColor: cat.color },
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={20}
                  color={isSelected ? cat.color : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && { color: cat.color },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('TeamSetup')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Continuă</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionChipActive: {
    backgroundColor: COLORS.primary + '30',
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  toggleDesc: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
});
