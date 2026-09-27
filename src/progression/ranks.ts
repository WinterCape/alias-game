import { Language } from '../i18n/strings';

export interface RankDefinition {
  level: number;
  xpRequired: number;
  name: Record<Language, string>;
  icon: string;
}

export const RANKS: RankDefinition[] = [
  { level: 1,  xpRequired: 0,    name: { ro: 'Ucenic', en: 'Apprentice', es: 'Aprendiz', fr: 'Apprenti', ru: 'Ученик' }, icon: 'school' },
  { level: 2,  xpRequired: 50,   name: { ro: 'Ucenic', en: 'Apprentice', es: 'Aprendiz', fr: 'Apprenti', ru: 'Ученик' }, icon: 'school' },
  { level: 3,  xpRequired: 125,  name: { ro: 'Cercetaș', en: 'Scout', es: 'Explorador', fr: 'Éclaireur', ru: 'Разведчик' }, icon: 'compass' },
  { level: 4,  xpRequired: 225,  name: { ro: 'Cercetaș', en: 'Scout', es: 'Explorador', fr: 'Éclaireur', ru: 'Разведчик' }, icon: 'compass' },
  { level: 5,  xpRequired: 375,  name: { ro: 'Războinic', en: 'Warrior', es: 'Guerrero', fr: 'Guerrier', ru: 'Воин' }, icon: 'sword' },
  { level: 6,  xpRequired: 575,  name: { ro: 'Războinic', en: 'Warrior', es: 'Guerrero', fr: 'Guerrier', ru: 'Воин' }, icon: 'sword' },
  { level: 7,  xpRequired: 850,  name: { ro: 'Cavaler', en: 'Knight', es: 'Caballero', fr: 'Chevalier', ru: 'Рыцарь' }, icon: 'shield-half-full' },
  { level: 8,  xpRequired: 1200, name: { ro: 'Cavaler', en: 'Knight', es: 'Caballero', fr: 'Chevalier', ru: 'Рыцарь' }, icon: 'shield-half-full' },
  { level: 9,  xpRequired: 1650, name: { ro: 'Campion', en: 'Champion', es: 'Campeón', fr: 'Champion', ru: 'Чемпион' }, icon: 'trophy' },
  { level: 10, xpRequired: 2200, name: { ro: 'Campion', en: 'Champion', es: 'Campeón', fr: 'Champion', ru: 'Чемпион' }, icon: 'trophy' },
  { level: 11, xpRequired: 2900, name: { ro: 'Erou', en: 'Hero', es: 'Héroe', fr: 'Héros', ru: 'Герой' }, icon: 'star-four-points' },
  { level: 12, xpRequired: 3750, name: { ro: 'Erou', en: 'Hero', es: 'Héroe', fr: 'Héros', ru: 'Герой' }, icon: 'star-four-points' },
  { level: 13, xpRequired: 4800, name: { ro: 'Legendă', en: 'Legend', es: 'Leyenda', fr: 'Légende', ru: 'Легенда' }, icon: 'crown' },
  { level: 14, xpRequired: 6100, name: { ro: 'Legendă', en: 'Legend', es: 'Leyenda', fr: 'Légende', ru: 'Легенда' }, icon: 'crown' },
  { level: 15, xpRequired: 7700, name: { ro: 'Arhimag', en: 'Archmage', es: 'Archimago', fr: 'Archimage', ru: 'Архимаг' }, icon: 'auto-fix' },
  { level: 16, xpRequired: 9600, name: { ro: 'Arhimag', en: 'Archmage', es: 'Archimago', fr: 'Archimage', ru: 'Архимаг' }, icon: 'auto-fix' },
  { level: 17, xpRequired: 12000, name: { ro: 'Mitic', en: 'Mythic', es: 'Mítico', fr: 'Mythique', ru: 'Мифический' }, icon: 'fire' },
  { level: 18, xpRequired: 15000, name: { ro: 'Mitic', en: 'Mythic', es: 'Mítico', fr: 'Mythique', ru: 'Мифический' }, icon: 'fire' },
  { level: 19, xpRequired: 19000, name: { ro: 'Nemuritor', en: 'Immortal', es: 'Inmortal', fr: 'Immortel', ru: 'Бессмертный' }, icon: 'infinity' },
  { level: 20, xpRequired: 25000, name: { ro: 'Nemuritor', en: 'Immortal', es: 'Inmortal', fr: 'Immortel', ru: 'Бессмертный' }, icon: 'infinity' },
];

export const XP_SOURCES = {
  wordGuessed: 1,
  gameWon: 5,
  flawlessRound: 3,
  achievementUnlocked: 10,
  questCorrectGuess: 2,
  questSuccessfulStorytelling: 1,
};

export const getRankForLevel = (level: number): RankDefinition => {
  const clamped = Math.max(1, Math.min(level, 20));
  return RANKS[clamped - 1];
};

export const getLevelForXP = (totalXP: number): number => {
  let level = 1;
  for (const rank of RANKS) {
    if (totalXP >= rank.xpRequired) {
      level = rank.level;
    } else {
      break;
    }
  }
  return level;
};

export const getXPProgress = (totalXP: number): { current: number; needed: number; progress: number } => {
  const level = getLevelForXP(totalXP);
  const currentRank = RANKS[level - 1];
  const nextRank = level < 20 ? RANKS[level] : null;

  if (!nextRank) {
    return { current: 0, needed: 0, progress: 1 };
  }

  const xpIntoLevel = totalXP - currentRank.xpRequired;
  const xpForLevel = nextRank.xpRequired - currentRank.xpRequired;
  return {
    current: xpIntoLevel,
    needed: xpForLevel,
    progress: xpForLevel > 0 ? xpIntoLevel / xpForLevel : 1,
  };
};
