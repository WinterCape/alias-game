import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useGame } from '../hooks/GameContext';
import { useI18n } from '../i18n/I18nContext';
import { TASKS, TASK_GROUP_ICONS, TaskGroup } from '../data/tasks';

const MAX_TASK_LENGTH = 120;

// Switch individual tasks on or off, and add the players' own tasks
export const TasksScreen = ({ navigation }: any) => {
  const { settings, updateSettings } = useGame();
  const { lang, t } = useI18n();
  const [draft, setDraft] = useState('');

  const disabled = settings.disabledTasks ?? [];
  const custom = settings.customTasks ?? [];

  const GROUPS: { id: TaskGroup; label: string }[] = [
    { id: 'emotions', label: t.taskGroupEmotions },
    { id: 'roles', label: t.taskGroupRoles },
    { id: 'moves', label: t.taskGroupMoves },
    { id: 'special', label: t.taskGroupSpecial },
  ];

  const toggleTask = (id: string) => {
    updateSettings({
      disabledTasks: disabled.includes(id) ? disabled.filter((d) => d !== id) : [...disabled, id],
    });
  };

  const addTask = () => {
    const text = draft.trim();
    if (!text) return;
    updateSettings({ customTasks: [...custom, { id: `custom-${Date.now()}`, text }] });
    setDraft('');
  };

  const deleteTask = (id: string) => {
    updateSettings({
      customTasks: custom.filter((task) => task.id !== id),
      disabledTasks: disabled.filter((d) => d !== id),
    });
  };

  const TaskRow = ({ id, text, onDelete }: { id: string; text: string; onDelete?: () => void }) => {
    const active = !disabled.includes(id);
    return (
      <View style={styles.taskRow}>
        <TouchableOpacity
          style={styles.taskToggle}
          onPress={() => toggleTask(id)}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: active }}
        >
          <MaterialCommunityIcons
            name={active ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={active ? COLORS.gold : COLORS.textSecondary}
          />
          <Text style={[styles.taskText, !active && styles.taskTextOff]}>{text}</Text>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t.deleteTask}
          >
            <MaterialCommunityIcons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={[...COLORS.gradientTable]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.taskList}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* The players' own tasks */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={TASK_GROUP_ICONS.custom as any} size={18} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>{t.myTasks}</Text>
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder={t.addTaskPlaceholder}
              placeholderTextColor={COLORS.textSecondary}
              maxLength={MAX_TASK_LENGTH}
              returnKeyType="done"
              onSubmitEditing={addTask}
              selectionColor={COLORS.gold}
            />
            <TouchableOpacity
              style={[styles.addBtn, !draft.trim() && styles.addBtnDisabled]}
              onPress={addTask}
              disabled={!draft.trim()}
              accessibilityRole="button"
              accessibilityLabel={t.addTask}
            >
              <MaterialCommunityIcons name="plus" size={24} color={COLORS.ink} />
            </TouchableOpacity>
          </View>
          {custom.map((task) => (
            <TaskRow key={task.id} id={task.id} text={task.text} onDelete={() => deleteTask(task.id)} />
          ))}

          {/* Built-in tasks by group */}
          {GROUPS.map((group) => (
            <View key={group.id}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name={TASK_GROUP_ICONS[group.id] as any} size={18} color={COLORS.gold} />
                <Text style={styles.sectionTitle}>{group.label}</Text>
              </View>
              {TASKS.filter((task) => task.group === group.id).map((task) => (
                <TaskRow key={task.id} id={task.id} text={task.text[lang]} />
              ))}
            </View>
          ))}
        </ScrollView>
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
    padding: SIZES.padding,
    paddingBottom: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,168,83,0.08)',
  },
  taskToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  taskText: {
    flex: 1,
    fontSize: SIZES.md,
    fontFamily: FONTS.body,
    color: COLORS.text,
  },
  taskTextOff: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    backgroundColor: 'rgba(212,168,83,0.04)',
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: SIZES.md,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
});
