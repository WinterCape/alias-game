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
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <MaterialCommunityIcons name="cards-playing-outline" size={80} color={COLORS.primary} />
        <Text style={styles.title}>ALIAS</Text>
        <Text style={styles.subtitle}>Jocul Cuvintelor</Text>
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>🇷🇴</Text>
          <Text style={styles.edition}>Ediția Română</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play" size={28} color="#FFF" />
          <Text style={styles.buttonText}>Joc Nou</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rulesButton]}
          onPress={() => navigation.navigate('Rules')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Reguli</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rulesButton]}
          onPress={() => navigation.navigate('Stats')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="chart-bar" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Statistici</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 12,
    marginTop: 16,
  },
  subtitle: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 4,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  edition: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  buttonContainer: {
    width: width * 0.75,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: SIZES.radius,
    gap: 12,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rulesButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
});
