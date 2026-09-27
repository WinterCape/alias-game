import { CategoryId } from '../types';

export type Language = 'ro' | 'en';

export interface Strings {
  // Home
  newAdventure: string;
  heroCode: string;
  chronicles: string;

  // Settings
  battlePrep: string;
  missionDuration: string;
  xpForVictory: string;
  numberOfGuilds: string;
  difficulty: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  difficultyAll: string;
  retreatPenalty: string;
  retreatPenaltyDesc: string;
  realms: string;
  allRealms: string;
  forward: string;

  // Team Setup
  guilds: string;
  chooseGuildNames: string;
  startAdventure: string;
  defaultTeams: string[];

  // Game
  prepareHeroes: string;
  givePhone: string;
  swipeRightCorrect: string;
  swipeLeftSkip: string;
  start: string;
  victory: string;
  retreat: string;
  guildRanking: string;
  exp: string;

  // Round Result
  roundResult: string;
  conquered: string;
  retreated: string;
  wordsConquered: string;
  wordsRetreated: string;
  nextMission: string;

  // Game Over
  congratsChampion: string;
  hallOfFame: string;
  newAdventureShort: string;

  // Rules
  rules: { title: string; text: string }[];

  // Stats
  chroniclesTitle: string;
  tabSummary: string;
  tabBattles: string;
  tabHallOfFame: string;
  adventures: string;
  conqueredStat: string;
  retreatedStat: string;
  missions: string;
  avgPerMission: string;
  conquestRate: string;
  mostGloriousMission: string;
  noAdventuresYet: string;
  noAdventuresDesc: string;
  noChampionYet: string;
  noChampionDesc: string;
  deleteChronicles: string;
  deleteConfirm: string;
  cancel: string;
  reset: string;
  victoryStat: string;
  victoriesStat: string;
  rounds: string;

  // Categories
  categoryNames: Record<CategoryId, string>;

  // Share
  shareResults: string;
  shareText: string;

  // Rate
  rateTitle: string;
  rateMessage: string;
  rateLater: string;
  rateNow: string;

  // Language picker
  language: string;
}

export const RO: Strings = {
  newAdventure: 'Aventură Nouă',
  heroCode: 'Codul Eroilor',
  chronicles: 'Cronici',
  battlePrep: 'Pregătire de Luptă',
  missionDuration: 'Durata Misiunii (secunde)',
  xpForVictory: 'Experiență pentru Victorie',
  numberOfGuilds: 'Număr de Bresle',
  difficulty: 'Dificultate',
  difficultyEasy: 'Ușor',
  difficultyMedium: 'Mediu',
  difficultyHard: 'Greu',
  difficultyAll: 'Toate',
  retreatPenalty: 'Penalizare la Retragere',
  retreatPenaltyDesc: '-1 punct pentru fiecare cuvânt sărit',
  realms: 'Tărâmuri',
  allRealms: 'Toate',
  forward: 'Înainte!',
  guilds: 'Bresle',
  chooseGuildNames: 'Alege numele breslelor tale',
  startAdventure: 'Începe Aventura!',
  defaultTeams: ['Dragonii', 'Vulturii', 'Lupii', 'Corbii'],
  prepareHeroes: 'Pregătiți-vă, eroi!',
  givePhone: 'Dă telefonul jucătorului care descrie.\nRestul echipei trebuie să ghicească.',
  swipeRightCorrect: 'Glisează dreapta = corect',
  swipeLeftSkip: 'Glisează stânga = retragere',
  start: 'START',
  victory: 'Victorie!',
  retreat: 'Retragere',
  guildRanking: 'Ierarhia Breslelor',
  exp: 'exp',
  roundResult: 'Rezultat Misiune',
  conquered: 'Cucerite',
  retreated: 'Retrase',
  wordsConquered: 'Cuvinte Cucerite',
  wordsRetreated: 'Cuvinte Retrase',
  nextMission: 'Următoarea Misiune',
  congratsChampion: 'Felicitări, Campion!',
  hallOfFame: 'Sala Faimei',
  newAdventureShort: 'Aventură Nouă',
  rules: [
    { title: 'Formează Bresle', text: 'Împărțiți-vă în 2-4 bresle. Fiecare breaslă își alege un nume de legendă.' },
    { title: 'Descrie Cuvântul', text: 'Un jucător din breaslă descrie cuvântul de pe pergament FĂRĂ a folosi cuvântul în sine.' },
    { title: 'Contra Cronometru', text: 'Aveți timp limitat. Fiecare cuvânt ghicit = +1 experiență pentru breaslă.' },
    { title: 'Retragere', text: 'Dacă nu poți descrie un cuvânt, te retragi. Atenție: retragerea poate costa -1 punct!' },
    { title: 'Campionul', text: 'Prima breaslă care atinge scorul de victorie devine Campion. De obicei 50 de puncte.' },
    { title: 'Interzis!', text: 'Nu poți: folosi cuvântul sau derivate, gesticula, indica obiecte, spune "rimează cu..."' },
  ],
  chroniclesTitle: 'Cronici',
  tabSummary: 'Rezumat',
  tabBattles: 'Bătălii',
  tabHallOfFame: 'Sala Faimei',
  adventures: 'Aventuri',
  conqueredStat: 'Cucerite',
  retreatedStat: 'Retrase',
  missions: 'Misiuni',
  avgPerMission: 'Media / Misiune',
  conquestRate: 'Rata Cucerire',
  mostGloriousMission: 'Cea Mai Glorioasă Misiune',
  noAdventuresYet: 'Nicio aventură încă',
  noAdventuresDesc: 'Joacă prima aventură pentru a vedea istoricul',
  noChampionYet: 'Niciun campion încă',
  noChampionDesc: 'Termină o aventură pentru a vedea clasamentul',
  deleteChronicles: 'Șterge Cronicile',
  deleteConfirm: 'Ești sigur că vrei să ștergi toate statisticile? Această acțiune nu poate fi anulată.',
  cancel: 'Anulează',
  reset: 'Resetează',
  victoryStat: 'victorie',
  victoriesStat: 'victorii',
  rounds: 'runde',
  categoryNames: {
    general: 'General',
    animale: 'Animale',
    mancare: 'Mâncare',
    sporturi: 'Sporturi',
    profesii: 'Profesii',
    natura: 'Natură',
    tehnologie: 'Tehnologie',
    filme: 'Filme & TV',
    muzica: 'Muzică',
    istorie: 'Istorie',
    geografie: 'Geografie',
    scoala: 'Școală',
    casa: 'Casă',
    emotii: 'Emoții',
    haine: 'Haine',
  },
  shareResults: 'Distribuie Rezultatul',
  shareText: '🏆 {winner} a câștigat cu {score} exp în Alias Quest!\n\n⚔️ Descarcă și tu: ',
  rateTitle: 'Îți place Alias Quest?',
  rateMessage: 'Dacă te distrezi, lasă-ne o recenzie! Ne ajută enorm.',
  rateLater: 'Mai târziu',
  rateNow: 'Recenzie',
  language: 'Limba',
};

export const EN: Strings = {
  newAdventure: 'New Adventure',
  heroCode: 'Hero\'s Code',
  chronicles: 'Chronicles',
  battlePrep: 'Battle Preparation',
  missionDuration: 'Mission Duration (seconds)',
  xpForVictory: 'XP for Victory',
  numberOfGuilds: 'Number of Guilds',
  difficulty: 'Difficulty',
  difficultyEasy: 'Easy',
  difficultyMedium: 'Medium',
  difficultyHard: 'Hard',
  difficultyAll: 'All',
  retreatPenalty: 'Retreat Penalty',
  retreatPenaltyDesc: '-1 point for each skipped word',
  realms: 'Realms',
  allRealms: 'All',
  forward: 'Onward!',
  guilds: 'Guilds',
  chooseGuildNames: 'Choose your guild names',
  startAdventure: 'Begin the Quest!',
  defaultTeams: ['Dragons', 'Eagles', 'Wolves', 'Ravens'],
  prepareHeroes: 'Prepare yourselves, heroes!',
  givePhone: 'Hand the phone to the describer.\nThe rest of the guild must guess.',
  swipeRightCorrect: 'Swipe right = correct',
  swipeLeftSkip: 'Swipe left = retreat',
  start: 'START',
  victory: 'Victory!',
  retreat: 'Retreat',
  guildRanking: 'Guild Rankings',
  exp: 'xp',
  roundResult: 'Mission Result',
  conquered: 'Conquered',
  retreated: 'Retreated',
  wordsConquered: 'Words Conquered',
  wordsRetreated: 'Words Retreated',
  nextMission: 'Next Mission',
  congratsChampion: 'Congratulations, Champion!',
  hallOfFame: 'Hall of Fame',
  newAdventureShort: 'New Adventure',
  rules: [
    { title: 'Form Guilds', text: 'Split into 2-4 guilds. Each guild picks a legendary name.' },
    { title: 'Describe the Word', text: 'One player describes the word on the parchment WITHOUT using the word itself.' },
    { title: 'Beat the Clock', text: 'You have limited time. Each guessed word = +1 XP for your guild.' },
    { title: 'Retreat', text: 'Can\'t describe a word? Retreat! Warning: retreating may cost -1 point!' },
    { title: 'The Champion', text: 'The first guild to reach the victory score becomes Champion. Usually 50 points.' },
    { title: 'Forbidden!', text: 'You cannot: use the word or derivatives, gesture, point at objects, say "rhymes with..."' },
  ],
  chroniclesTitle: 'Chronicles',
  tabSummary: 'Summary',
  tabBattles: 'Battles',
  tabHallOfFame: 'Hall of Fame',
  adventures: 'Adventures',
  conqueredStat: 'Conquered',
  retreatedStat: 'Retreated',
  missions: 'Missions',
  avgPerMission: 'Avg / Mission',
  conquestRate: 'Conquest Rate',
  mostGloriousMission: 'Most Glorious Mission',
  noAdventuresYet: 'No adventures yet',
  noAdventuresDesc: 'Play your first adventure to see history',
  noChampionYet: 'No champion yet',
  noChampionDesc: 'Finish an adventure to see the rankings',
  deleteChronicles: 'Erase Chronicles',
  deleteConfirm: 'Are you sure you want to delete all statistics? This action cannot be undone.',
  cancel: 'Cancel',
  reset: 'Reset',
  victoryStat: 'victory',
  victoriesStat: 'victories',
  rounds: 'rounds',
  categoryNames: {
    general: 'General',
    animale: 'Animals',
    mancare: 'Food',
    sporturi: 'Sports',
    profesii: 'Professions',
    natura: 'Nature',
    tehnologie: 'Technology',
    filme: 'Movies & TV',
    muzica: 'Music',
    istorie: 'History',
    geografie: 'Geography',
    scoala: 'School',
    casa: 'Home',
    emotii: 'Emotions',
    haine: 'Clothing',
  },
  shareResults: 'Share Results',
  shareText: '🏆 {winner} won with {score} xp in Alias Quest!\n\n⚔️ Download it too: ',
  rateTitle: 'Enjoying Alias Quest?',
  rateMessage: 'If you\'re having fun, leave us a review! It helps a lot.',
  rateLater: 'Later',
  rateNow: 'Rate',
  language: 'Language',
};

const STRINGS: Record<Language, Strings> = { ro: RO, en: EN };

export const getStrings = (lang: Language): Strings => STRINGS[lang];
