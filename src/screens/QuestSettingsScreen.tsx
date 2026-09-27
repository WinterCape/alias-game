import React, { useState } from 'react';
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
import { useI18n } from '../i18n/I18nContext';
import { CategoryId, Difficulty } from '../types';

const WINNING_SCORES = [5, 10, 15, 20];

export const QuestSettingsScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const [winningScore, setWinningScore] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([...ALL_CATEGORIES]);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const allSelected = selectedCategories.length === ALL_CATEGORIES.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCategories([ALL_CATEGORIES[0]]);
    } else {
      setSelectedCategories([...ALL_CATEGORIES]);
    }
  };

  const toggleCategory = (id: CategoryId) => {
    if (selectedCategories.includes(id)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== id));
      }
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const difficulties: { id: Difficulty | 'all'; label: string; icon: string }[] = [
    { id: 'easy', label: t.difficultyEasy, icon: 'shield-outline' },
    { id: 'medium', label: t.difficultyMedium, icon: 'shield-half-full' },
    { id: 'hard', label: t.difficultyHard, icon: 'shield' },
    { id: 'all', label: t.difficultyAll, icon: 'sword-cross' },
  ];

  const handleContinue = () => {
    navigation.navigate('QuestPlayerSetup', {
      settings: { winningScore, selectedCategories, difficulty },
    });
  };

  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.questMode}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="star-four-points" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>{t.pointsToWin}</Text>
        </View>
        <View style={styles.optionRow}>
          {WINNING_SCORES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, winningScore === s && styles.chipActive]}
              onPress={() => setWinningScore(s)}
            >
              <Text style={[styles.chipText, winningScore === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="sword" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>{t.difficulty}</Text>
        </View>
        <View style={styles.optionRow}>
          {difficulties.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.chip, styles.diffChip, difficulty === d.id && styles.chipActive]}
              onPress={() => setDifficulty(d.id)}
            >
              <MaterialCommunityIcons
                name={d.icon as any}
                size={16}
                color={difficulty === d.id ? COLORS.gold : COLORS.textSecondary}
              />
              <Text style={[styles.chipText, difficulty === d.id && styles.chipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="map-legend" size={18} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>{t.realms}</Text>
        </View>
        <View style={styles.catGrid}>
          <TouchableOpacity
            style={[styles.chip, styles.allChip, allSelected && styles.allChipActive]}
            onPress={toggleAll}
          >
            <MaterialCommunityIcons name="earth" size={18} color={allSelected ? COLORS.goldBright : COLORS.textSecondary} />
            <Text style={[styles.chipText, allSelected && { color: COLORS.goldBright, fontFamily: FONTS.bodyBlack }]}>{t.allRealms}</Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => {
            const selected = selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => toggleCategory(cat.id)}
              >
                <MaterialCommunityIcons name={cat.icon as any} size={16} color={selected ? COLORS.goldBright : COLORS.textSecondary} />
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>{t.categoryNames[cat.id]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.startBtnText}>{t.forward}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={COLORS.ink} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(212,168,83,0.08)', borderWidth: 1, borderColor: 'rgba(212,168,83,0.2)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: SIZES.xl, fontFamily: FONTS.displayBlack, color: COLORS.gold },
  scroll: { flex: 1 },
  scrollContent: { padding: SIZES.padding, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: SIZES.lg, fontFamily: FONTS.display, color: COLORS.text },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(212,168,83,0.04)', borderWidth: 1, borderColor: 'rgba(212,168,83,0.1)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipActive: { backgroundColor: 'rgba(212,168,83,0.15)', borderColor: COLORS.gold },
  chipText: { fontSize: SIZES.sm, fontFamily: FONTS.bodyBold, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.gold },
  diffChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allChip: { borderStyle: 'dashed' as any, borderColor: 'rgba(212,168,83,0.25)' },
  allChipActive: { backgroundColor: 'rgba(212,168,83,0.2)', borderColor: COLORS.goldBright, borderStyle: 'solid' as any },
  footer: { paddingHorizontal: SIZES.padding, paddingBottom: 40, paddingTop: 10 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.gold, paddingVertical: 18, borderRadius: SIZES.radius },
  startBtnText: { fontSize: SIZES.lg, fontFamily: FONTS.displayBlack, color: COLORS.ink },
});
