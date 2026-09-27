import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';

const PLAYER_COLORS = [
  '#D4A853',
  '#9B2335',
  '#2D6A4F',
  '#5E548E',
  '#E91E63',
  '#FF9800',
  '#00BCD4',
  '#4CAF50',
];

export const QuestPlayerSetup = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const { onStart, settings } = route.params;
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddPlayer = () => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;
    setPlayerNames((prev) => [...prev, trimmed]);
    setInputValue('');
  };

  const handleRemovePlayer = (index: number) => {
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    if (playerNames.length < 3) return;
    onStart(playerNames);
    navigation.navigate('QuestGame', { playerNames, settings });
  };

  const canStart = playerNames.length >= 3;

  return (
    <LinearGradient colors={['#0D0A1A', '#161230', '#0D0A1A']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.players}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Add Player Input */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={t.playerName}
                placeholderTextColor={COLORS.textSecondary}
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
                selectionColor={COLORS.gold}
                maxLength={20}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.addBtn,
                inputValue.trim().length === 0 && styles.addBtnDisabled,
              ]}
              onPress={handleAddPlayer}
              activeOpacity={0.7}
              disabled={inputValue.trim().length === 0}
            >
              <MaterialCommunityIcons
                name="plus"
                size={28}
                color={inputValue.trim().length > 0 ? '#FFF' : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Player Cards */}
          {playerNames.map((name, index) => {
            const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
            return (
              <View key={`${index}-${name}`} style={styles.playerCard}>
                <View style={[styles.playerDot, { backgroundColor: color }]} />
                <Text style={styles.playerName} numberOfLines={1}>
                  {name}
                </Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePlayer(index)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialCommunityIcons name="close" size={18} color={COLORS.skipGlow} />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Min Players Warning */}
          {playerNames.length > 0 && playerNames.length < 3 && (
            <View style={styles.warningRow}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.gold} />
              <Text style={styles.warningText}>{t.minPlayers}</Text>
            </View>
          )}

          {/* Empty state */}
          {playerNames.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-group" size={48} color={COLORS.gold + '40'} />
              <Text style={styles.emptyText}>{t.addPlayer}</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.startButton, !canStart && styles.startButtonDisabled]}
            onPress={handleStart}
            activeOpacity={0.8}
            disabled={!canStart}
          >
            <MaterialCommunityIcons
              name="sword-cross"
              size={28}
              color={canStart ? COLORS.parchment : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.startButtonText,
                !canStart && styles.startButtonTextDisabled,
              ]}
            >
              {t.startAdventure}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
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
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: SIZES.lg,
    color: COLORS.text,
    fontFamily: FONTS.body,
    paddingVertical: 14,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.correct,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.correctGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.backgroundLight,
    elevation: 0,
    shadowOpacity: 0,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderRadius: SIZES.cardRadius,
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
    padding: 14,
    marginBottom: 10,
  },
  playerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 14,
  },
  playerName: {
    flex: 1,
    fontSize: SIZES.lg,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.skip + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  warningText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
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
  startButtonDisabled: {
    backgroundColor: COLORS.backgroundLight,
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: COLORS.gold + '15',
  },
  startButtonText: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.displayBlack,
    color: COLORS.parchment,
  },
  startButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
});
