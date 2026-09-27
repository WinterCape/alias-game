import { Language } from '../i18n/strings';
import { PackId } from '../store/packs';

export type RewardType = 'pack_unlock' | 'timer_option' | 'score_option' | 'team_slots' | 'quest_hint' | 'badge' | 'rank_glow' | 'funny_names';

export interface LevelReward {
  level: number;
  type: RewardType;
  value: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  packId?: PackId;
}

export const LEVEL_REWARDS: LevelReward[] = [
  {
    level: 2,
    type: 'timer_option',
    value: '150',
    icon: 'timer-plus',
    name: { ro: 'Timp Extins', en: 'Extended Time', es: 'Tiempo Extra', fr: 'Temps Prolongé', ru: 'Доп. Время' },
    description: { ro: 'Opțiune 150s pentru rundă', en: '150s round option unlocked', es: 'Opción de ronda de 150s', fr: 'Option de tour de 150s', ru: 'Раунд 150 секунд' },
  },
  {
    level: 3,
    type: 'pack_unlock',
    value: 'popculture',
    packId: 'popculture',
    icon: 'star-shooting',
    name: { ro: 'Cultură Pop', en: 'Pop Culture', es: 'Cultura Pop', fr: 'Culture Pop', ru: 'Поп-культура' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 4,
    type: 'funny_names',
    value: 'epic',
    icon: 'dice-multiple',
    name: { ro: 'Nume Epice', en: 'Epic Names', es: 'Nombres Épicos', fr: 'Noms Épiques', ru: 'Эпичные Имена' },
    description: { ro: 'Set nou de nume amuzante', en: 'New set of funny team names', es: 'Nuevo set de nombres', fr: 'Nouveau set de noms', ru: 'Новый набор имён' },
  },
  {
    level: 5,
    type: 'pack_unlock',
    value: 'mythology',
    packId: 'mythology',
    icon: 'chess-knight',
    name: { ro: 'Mitologie & Legende', en: 'Mythology & Legends', es: 'Mitología y Leyendas', fr: 'Mythologie & Légendes', ru: 'Мифология и Легенды' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 6,
    type: 'score_option',
    value: '200',
    icon: 'star-four-points',
    name: { ro: 'Victorie Epică', en: 'Epic Victory', es: 'Victoria Épica', fr: 'Victoire Épique', ru: 'Эпическая Победа' },
    description: { ro: 'Opțiune scor 200 pentru victorie', en: '200 winning score option', es: 'Opción de puntuación 200', fr: 'Option score de victoire 200', ru: 'Победный счёт 200' },
  },
  {
    level: 7,
    type: 'pack_unlock',
    value: 'party18',
    packId: 'party18',
    icon: 'glass-cocktail',
    name: { ro: 'Petrecere 18+', en: 'Party 18+', es: 'Fiesta 18+', fr: 'Fête 18+', ru: 'Вечеринка 18+' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 8,
    type: 'team_slots',
    value: '5',
    icon: 'account-group',
    name: { ro: 'Breaslă a 5-a', en: '5th Guild Slot', es: '5to Gremio', fr: '5e Guilde', ru: '5-я Гильдия' },
    description: { ro: 'Poți juca cu 5 echipe', en: 'Play with up to 5 teams', es: 'Juega con 5 equipos', fr: 'Jouez avec 5 équipes', ru: 'Играйте 5 командами' },
  },
  {
    level: 9,
    type: 'pack_unlock',
    value: 'science',
    packId: 'science',
    icon: 'flask',
    name: { ro: 'Știință & Medicină', en: 'Science & Medicine', es: 'Ciencia y Medicina', fr: 'Science & Médecine', ru: 'Наука и Медицина' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 10,
    type: 'timer_option',
    value: '180',
    icon: 'timer-plus',
    name: { ro: 'Maraton', en: 'Marathon', es: 'Maratón', fr: 'Marathon', ru: 'Марафон' },
    description: { ro: 'Opțiune 180s pentru rundă', en: '180s round option unlocked', es: 'Opción de ronda de 180s', fr: 'Option de tour de 180s', ru: 'Раунд 180 секунд' },
  },
  {
    level: 11,
    type: 'pack_unlock',
    value: 'business',
    packId: 'business',
    icon: 'briefcase',
    name: { ro: 'Business & Finanțe', en: 'Business & Finance', es: 'Negocios y Finanzas', fr: 'Business & Finance', ru: 'Бизнес и Финансы' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 12,
    type: 'quest_hint',
    value: '6',
    icon: 'lightbulb-on',
    name: { ro: 'Indiciu Extra', en: 'Extra Hint', es: 'Pista Extra', fr: 'Indice Extra', ru: 'Доп. Подсказка' },
    description: { ro: '6 indicii în Quest (în loc de 5)', en: '6 hints in Quest (instead of 5)', es: '6 pistas en Quest', fr: '6 indices en Quête', ru: '6 подсказок в Квесте' },
  },
  {
    level: 13,
    type: 'pack_unlock',
    value: 'traditions',
    packId: 'traditions',
    icon: 'flower-tulip',
    name: { ro: 'Tradiții Românești', en: 'Romanian Traditions', es: 'Tradiciones Rumanas', fr: 'Traditions Roumaines', ru: 'Румынские Традиции' },
    description: { ro: 'Pachet de cuvinte deblocat!', en: 'Word pack unlocked!', es: '¡Paquete desbloqueado!', fr: 'Pack de mots débloqué !', ru: 'Набор слов разблокирован!' },
  },
  {
    level: 14,
    type: 'score_option',
    value: '150',
    icon: 'star-four-points',
    name: { ro: 'Scor Extins', en: 'Extended Score', es: 'Puntuación Extendida', fr: 'Score Étendu', ru: 'Расширенный Счёт' },
    description: { ro: 'Opțiune scor 150 pentru victorie', en: '150 winning score option', es: 'Opción puntuación 150', fr: 'Option score 150', ru: 'Победный счёт 150' },
  },
  {
    level: 15,
    type: 'badge',
    value: 'all_packs',
    icon: 'shield-check',
    name: { ro: 'Colecționar', en: 'Collector', es: 'Coleccionista', fr: 'Collectionneur', ru: 'Коллекционер' },
    description: { ro: 'Toate pachetele deblocate prin nivel!', en: 'All packs earned through leveling!', es: '¡Todos los paquetes desbloqueados!', fr: 'Tous les packs débloqués !', ru: 'Все наборы разблокированы!' },
  },
  {
    level: 16,
    type: 'badge',
    value: 'veteran_badge',
    icon: 'medal',
    name: { ro: 'Insigna Veteranului', en: 'Veteran Badge', es: 'Insignia Veterano', fr: 'Badge Vétéran', ru: 'Знак Ветерана' },
    description: { ro: 'Insignă specială pe profil', en: 'Special badge on your profile', es: 'Insignia especial en perfil', fr: 'Badge spécial sur profil', ru: 'Спец. значок на профиле' },
  },
];

export const getRewardsForLevel = (level: number): LevelReward[] =>
  LEVEL_REWARDS.filter((r) => r.level === level);

export const getRewardsUpToLevel = (level: number): LevelReward[] =>
  LEVEL_REWARDS.filter((r) => r.level <= level);

export const getPackUnlockLevel = (packId: PackId): number | null => {
  const reward = LEVEL_REWARDS.find((r) => r.packId === packId);
  return reward ? reward.level : null;
};

export const isPackUnlockedByLevel = (packId: PackId, currentLevel: number): boolean => {
  const unlockLevel = getPackUnlockLevel(packId);
  return unlockLevel !== null && currentLevel >= unlockLevel;
};

export const getUnlockedTimerOptions = (level: number): number[] => {
  const base = [30, 45, 60, 90, 120];
  const extras = LEVEL_REWARDS
    .filter((r) => r.type === 'timer_option' && r.level <= level)
    .map((r) => parseInt(r.value, 10));
  return [...base, ...extras].sort((a, b) => a - b);
};

export const getUnlockedScoreOptions = (level: number): number[] => {
  const base = [25, 50, 75, 100];
  const extras = LEVEL_REWARDS
    .filter((r) => r.type === 'score_option' && r.level <= level)
    .map((r) => parseInt(r.value, 10));
  return [...new Set([...base, ...extras])].sort((a, b) => a - b);
};

export const getMaxTeams = (level: number): number => {
  const teamReward = LEVEL_REWARDS.find((r) => r.type === 'team_slots' && r.level <= level);
  return teamReward ? parseInt(teamReward.value, 10) : 4;
};

export const getMaxHints = (level: number): number => {
  const hintReward = LEVEL_REWARDS.find((r) => r.type === 'quest_hint' && r.level <= level);
  return hintReward ? parseInt(hintReward.value, 10) : 5;
};
