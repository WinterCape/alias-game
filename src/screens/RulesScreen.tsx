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
import { COLORS, FONTS, SIZES } from '../constants/theme';

const RULES = [
  {
    icon: 'shield-half-full' as const,
    title: 'Formează Bresle',
    text: 'Împărțiți-vă în 2-4 bresle. Fiecare breaslă își alege un nume legendar.',
  },
  {
    icon: 'script-text' as const,
    title: 'Descrie Cuvântul',
    text: 'Un erou din breaslă descrie cuvântul afișat FĂRĂ a folosi cuvântul în sine sau derivate ale acestuia.',
  },
  {
    icon: 'timer-sand' as const,
    title: 'Contra Cronometru',
    text: 'Aveți un timp limitat pentru misiune. Fiecare cuvânt ghicit corect = 1 punct de experiență.',
  },
  {
    icon: 'run-fast' as const,
    title: 'Retragere Tactică',
    text: 'Dacă nu poți explica un cuvânt, te poți retrage. Atenție: retragerea poate fi penalizată cu -1 punct!',
  },
  {
    icon: 'trophy' as const,
    title: 'Devino Campion!',
    text: 'Prima breaslă care ajunge la experiența stabilită câștigă aventura. De obicei 50 de puncte.',
  },
  {
    icon: 'sword-cross' as const,
    title: 'Reguli Interzise',
    text: 'Nu poți: folosi cuvântul sau părți din el, gesticula, indica obiecte din cameră, spune "rimează cu..."',
  },
];

export const RulesScreen = ({ navigation }: any) => {
  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>Codul Eroilor</Text>
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
                  color={COLORS.gold}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.1)',
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  ruleNumberText: {
    color: COLORS.parchment,
    fontFamily: FONTS.bodyBlack,
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
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  ruleText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
