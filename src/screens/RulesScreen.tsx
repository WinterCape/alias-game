import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const RULES = [
  {
    icon: 'account-group' as const,
    title: 'Formează Echipe',
    text: 'Împărțiți-vă în 2-4 echipe. Fiecare echipă alege un nume creativ.',
  },
  {
    icon: 'message-text' as const,
    title: 'Explică Cuvântul',
    text: 'Un jucător din echipă descrie cuvântul afișat FĂRĂ a folosi cuvântul în sine sau derivate ale acestuia.',
  },
  {
    icon: 'timer' as const,
    title: 'Contra Cronometru',
    text: 'Aveți un timp limitat pentru a ghici cât mai multe cuvinte. Fiecare cuvânt ghicit corect = 1 punct.',
  },
  {
    icon: 'skip-next' as const,
    title: 'Poți Sări',
    text: 'Dacă nu poți explica un cuvânt, îl poți sări. Atenție: saritul poate fi penalizat cu -1 punct!',
  },
  {
    icon: 'trophy' as const,
    title: 'Câștigă!',
    text: 'Prima echipă care ajunge la scorul stabilit câștigă jocul. De obicei 50 de puncte.',
  },
  {
    icon: 'close-circle' as const,
    title: 'Reguli Interzise',
    text: 'Nu poți: folosi cuvântul sau părți din el, gesticula, indica obiecte din cameră, spune "rimează cu..."',
  },
];

export const RulesScreen = ({ navigation }: any) => {
  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Reguli</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {RULES.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.ruleContent}>
              <View style={styles.ruleTitleRow}>
                <MaterialCommunityIcons
                  name={rule.icon}
                  size={22}
                  color={COLORS.primary}
                />
                <Text style={styles.ruleTitle}>{rule.title}</Text>
              </View>
              <Text style={styles.ruleText}>{rule.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  ruleNumberText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: SIZES.md,
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  ruleText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
