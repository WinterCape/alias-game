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
import { COLORS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';

const TEAM_COLORS = ['#6C63FF', '#FF6584', '#43E97B', '#FFA502'];
const TEAM_ICONS: Array<'account-group' | 'fire' | 'lightning-bolt' | 'star'> = [
  'account-group',
  'fire',
  'lightning-bolt',
  'star',
];

export const TeamSetupScreen = ({ navigation }: any) => {
  const { settings, initializeTeams } = useGame();
  const [teamNames, setTeamNames] = useState<string[]>(
    Array.from({ length: settings.numberOfTeams }, (_, i) => `Echipa ${i + 1}`)
  );

  const handleStart = () => {
    initializeTeams(teamNames);
    navigation.navigate('Game');
  };

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Echipe</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Alege numele echipelor</Text>

        {teamNames.map((name, index) => (
          <View key={index} style={[styles.teamCard, { borderColor: TEAM_COLORS[index] + '60' }]}>
            <View style={[styles.teamIcon, { backgroundColor: TEAM_COLORS[index] + '30' }]}>
              <MaterialCommunityIcons
                name={TEAM_ICONS[index]}
                size={28}
                color={TEAM_COLORS[index]}
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
              selectionColor={TEAM_COLORS[index]}
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play" size={28} color="#FFF" />
          <Text style={styles.startButtonText}>Începe Jocul!</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: SIZES.radius,
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
    fontWeight: '600',
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
    backgroundColor: COLORS.success,
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    elevation: 8,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
});
