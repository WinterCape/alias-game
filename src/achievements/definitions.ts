import { Language } from '../i18n/strings';

export type AchievementId =
  | 'first_blood'
  | 'ten_games'
  | 'fifty_games'
  | 'hundred_words'
  | 'five_hundred_words'
  | 'thousand_words'
  | 'flawless_round'
  | 'speed_demon'
  | 'no_retreat'
  | 'polyglot'
  | 'quest_master'
  | 'hint_hater'
  | 'storyteller'
  | 'social_butterfly'
  | 'night_owl'
  | 'completionist';

export interface Achievement {
  id: AchievementId;
  icon: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  secret: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    icon: 'sword',
    name: { ro: 'Prima Victorie', en: 'First Blood', es: 'Primera Sangre', fr: 'Premier Sang', ru: 'Первая Кровь' },
    description: {
      ro: 'Termină primul joc',
      en: 'Complete your first game',
      es: 'Completa tu primer juego',
      fr: 'Terminez votre premier jeu',
      ru: 'Завершите первую игру',
    },
    secret: false,
  },
  {
    id: 'ten_games',
    icon: 'shield-star',
    name: { ro: 'Veteran', en: 'Veteran', es: 'Veterano', fr: 'Vétéran', ru: 'Ветеран' },
    description: {
      ro: 'Joacă 10 jocuri',
      en: 'Play 10 games',
      es: 'Juega 10 partidas',
      fr: 'Jouez 10 parties',
      ru: 'Сыграйте 10 игр',
    },
    secret: false,
  },
  {
    id: 'fifty_games',
    icon: 'crown',
    name: { ro: 'Legendă', en: 'Legend', es: 'Leyenda', fr: 'Légende', ru: 'Легенда' },
    description: {
      ro: 'Joacă 50 de jocuri',
      en: 'Play 50 games',
      es: 'Juega 50 partidas',
      fr: 'Jouez 50 parties',
      ru: 'Сыграйте 50 игр',
    },
    secret: false,
  },
  {
    id: 'hundred_words',
    icon: 'book-open-variant',
    name: { ro: 'Vocabular', en: 'Wordsmith', es: 'Lingüista', fr: 'Linguiste', ru: 'Словарь' },
    description: {
      ro: 'Ghicește 100 de cuvinte',
      en: 'Guess 100 words',
      es: 'Adivina 100 palabras',
      fr: 'Devinez 100 mots',
      ru: 'Угадайте 100 слов',
    },
    secret: false,
  },
  {
    id: 'five_hundred_words',
    icon: 'library',
    name: { ro: 'Erudit', en: 'Scholar', es: 'Erudito', fr: 'Érudit', ru: 'Эрудит' },
    description: {
      ro: 'Ghicește 500 de cuvinte',
      en: 'Guess 500 words',
      es: 'Adivina 500 palabras',
      fr: 'Devinez 500 mots',
      ru: 'Угадайте 500 слов',
    },
    secret: false,
  },
  {
    id: 'thousand_words',
    icon: 'star-circle',
    name: { ro: 'Maestru al Cuvintelor', en: 'Word Master', es: 'Maestro de Palabras', fr: 'Maître des Mots', ru: 'Мастер Слов' },
    description: {
      ro: 'Ghicește 1000 de cuvinte',
      en: 'Guess 1000 words',
      es: 'Adivina 1000 palabras',
      fr: 'Devinez 1000 mots',
      ru: 'Угадайте 1000 слов',
    },
    secret: false,
  },
  {
    id: 'flawless_round',
    icon: 'diamond-stone',
    name: { ro: 'Perfecțiune', en: 'Flawless', es: 'Perfección', fr: 'Perfection', ru: 'Безупречность' },
    description: {
      ro: 'Termină o rundă fără nicio retragere',
      en: 'Complete a round with zero skips',
      es: 'Completa una ronda sin saltar',
      fr: 'Terminez un tour sans aucun skip',
      ru: 'Завершите раунд без пропусков',
    },
    secret: false,
  },
  {
    id: 'speed_demon',
    icon: 'lightning-bolt',
    name: { ro: 'Fulger', en: 'Speed Demon', es: 'Rayo', fr: 'Éclair', ru: 'Молния' },
    description: {
      ro: 'Ghicește 10+ cuvinte într-o rundă',
      en: 'Guess 10+ words in a single round',
      es: 'Adivina 10+ palabras en una ronda',
      fr: 'Devinez 10+ mots en un seul tour',
      ru: '10+ слов за один раунд',
    },
    secret: false,
  },
  {
    id: 'no_retreat',
    icon: 'shield-check',
    name: { ro: 'Fără Retragere', en: 'No Retreat', es: 'Sin Retirada', fr: 'Sans Retraite', ru: 'Без Отступления' },
    description: {
      ro: 'Câștigă un joc fără nicio retragere',
      en: 'Win a game with zero skips',
      es: 'Gana un juego sin saltar',
      fr: 'Gagnez un jeu sans skip',
      ru: 'Выиграйте игру без пропусков',
    },
    secret: false,
  },
  {
    id: 'polyglot',
    icon: 'translate',
    name: { ro: 'Poliglot', en: 'Polyglot', es: 'Políglota', fr: 'Polyglotte', ru: 'Полиглот' },
    description: {
      ro: 'Joacă în 3 limbi diferite',
      en: 'Play in 3 different languages',
      es: 'Juega en 3 idiomas diferentes',
      fr: 'Jouez en 3 langues différentes',
      ru: 'Сыграйте на 3 разных языках',
    },
    secret: false,
  },
  {
    id: 'quest_master',
    icon: 'book-open-page-variant',
    name: { ro: 'Maestrul Aventurii', en: 'Quest Master', es: 'Maestro de Misiones', fr: 'Maître de Quête', ru: 'Мастер Квестов' },
    description: {
      ro: 'Câștigă 5 jocuri în modul Aventură',
      en: 'Win 5 Quest mode games',
      es: 'Gana 5 juegos en modo Aventura',
      fr: 'Gagnez 5 parties en mode Quête',
      ru: 'Выиграйте 5 игр в режиме Квест',
    },
    secret: false,
  },
  {
    id: 'hint_hater',
    icon: 'eye-off',
    name: { ro: 'Fără Indicii', en: 'No Hints Needed', es: 'Sin Pistas', fr: 'Sans Indices', ru: 'Без Подсказок' },
    description: {
      ro: 'Ghicește un cuvânt în Quest fără niciun indiciu',
      en: 'Guess a word in Quest without any hints',
      es: 'Adivina una palabra sin pistas',
      fr: 'Devinez un mot sans aucun indice',
      ru: 'Угадайте слово без подсказок',
    },
    secret: false,
  },
  {
    id: 'storyteller',
    icon: 'account-voice',
    name: { ro: 'Povestitor', en: 'Storyteller', es: 'Narrador', fr: 'Conteur', ru: 'Рассказчик' },
    description: {
      ro: 'Fii povestitor de 20 de ori',
      en: 'Be the storyteller 20 times',
      es: 'Sé narrador 20 veces',
      fr: 'Soyez conteur 20 fois',
      ru: 'Будьте рассказчиком 20 раз',
    },
    secret: false,
  },
  {
    id: 'social_butterfly',
    icon: 'account-group',
    name: { ro: 'Sufletul Petrecerii', en: 'Social Butterfly', es: 'Alma de la Fiesta', fr: 'Boute-en-train', ru: 'Душа Компании' },
    description: {
      ro: 'Joacă cu 6+ jucători în Quest',
      en: 'Play Quest with 6+ players',
      es: 'Juega Quest con 6+ jugadores',
      fr: 'Jouez Quête avec 6+ joueurs',
      ru: 'Сыграйте в Квест с 6+ игроками',
    },
    secret: false,
  },
  {
    id: 'night_owl',
    icon: 'weather-night',
    name: { ro: 'Bufnița Nopții', en: 'Night Owl', es: 'Búho Nocturno', fr: 'Oiseau de Nuit', ru: 'Ночная Сова' },
    description: {
      ro: 'Joacă după miezul nopții',
      en: 'Play a game after midnight',
      es: 'Juega después de medianoche',
      fr: 'Jouez après minuit',
      ru: 'Сыграйте после полуночи',
    },
    secret: true,
  },
  {
    id: 'completionist',
    icon: 'trophy',
    name: { ro: 'Completist', en: 'Completionist', es: 'Completista', fr: 'Complétiste', ru: 'Коллекционер' },
    description: {
      ro: 'Deblocare toate realizările',
      en: 'Unlock all achievements',
      es: 'Desbloquea todos los logros',
      fr: 'Débloquez tous les succès',
      ru: 'Разблокируйте все достижения',
    },
    secret: true,
  },
];
