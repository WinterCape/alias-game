import { Language } from '../i18n/strings';

// Task rounds: some rounds give the explainer an extra challenge.
// All tasks below are written for Alias Quest.

export type TaskGroup = 'emotions' | 'roles' | 'moves' | 'special';

export type TaskFrequency = 'off' | 'rare' | 'often' | 'always';

export interface GameTask {
  id: string;
  group: TaskGroup;
  text: Record<Language, string>;
}

// A task written by the players, in whatever language they play
export interface CustomTask {
  id: string;
  text: string;
}

export const TASK_GROUP_ICONS: Record<TaskGroup | 'custom', string> = {
  emotions: 'emoticon-outline',
  roles: 'drama-masks',
  moves: 'run',
  special: 'star-four-points',
  custom: 'pencil',
};

export const TASK_FREQUENCY_CHANCE: Record<TaskFrequency, number> = {
  off: 0,
  rare: 0.25,
  often: 0.5,
  always: 1,
};

export const TASKS: GameTask[] = [
  // Emotions
  { id: 'happy', group: 'emotions', text: {
    ro: 'Explică de parcă ești cel mai fericit om din lume',
    en: "Explain as if you're the happiest person in the world",
    es: 'Explica como si fueras la persona más feliz del mundo',
    fr: 'Explique comme si tu étais la personne la plus heureuse du monde',
    ru: 'Объясняй так, будто ты самый счастливый человек на свете',
  } },
  { id: 'tearful', group: 'emotions', text: {
    ro: 'Explică de parcă ești gata să izbucnești în plâns',
    en: "Explain as if you're about to burst into tears",
    es: 'Explica como si estuvieras a punto de llorar',
    fr: 'Explique comme si tu allais fondre en larmes',
    ru: 'Объясняй так, будто вот-вот расплачешься',
  } },
  { id: 'grumpy', group: 'emotions', text: {
    ro: 'Explică foarte bosumflat, ca și cum totul te enervează',
    en: 'Explain very grumpily, as if everything annoys you',
    es: 'Explica de muy mal humor, como si todo te molestara',
    fr: 'Explique de très mauvaise humeur, comme si tout t\'agaçait',
    ru: 'Объясняй очень ворчливо, будто тебя всё раздражает',
  } },
  { id: 'scared', group: 'emotions', text: {
    ro: 'Explică speriat, privind mereu peste umăr',
    en: 'Explain nervously, glancing over your shoulder all the time',
    es: 'Explica asustado, mirando todo el rato por encima del hombro',
    fr: 'Explique avec peur, en regardant sans cesse par-dessus ton épaule',
    ru: 'Объясняй испуганно, постоянно оглядываясь через плечо',
  } },
  { id: 'sleepy', group: 'emotions', text: {
    ro: 'Explică foarte somnoros, căscând des',
    en: 'Explain very sleepily, yawning often',
    es: 'Explica con mucho sueño, bostezando a menudo',
    fr: 'Explique en ayant très sommeil, en bâillant souvent',
    ru: 'Объясняй очень сонно, часто зевая',
  } },
  { id: 'amazed', group: 'emotions', text: {
    ro: 'Fii uimit de fiecare cuvânt pe care îl vezi',
    en: 'Be amazed by every word you see',
    es: 'Asómbrate con cada palabra que veas',
    fr: 'Sois émerveillé par chaque mot que tu vois',
    ru: 'Изумляйся каждому слову, которое видишь',
  } },
  { id: 'dreamy', group: 'emotions', text: {
    ro: 'Explică visător, ca un îndrăgostit',
    en: 'Explain dreamily, like someone in love',
    es: 'Explica soñador, como alguien enamorado',
    fr: 'Explique d\'un air rêveur, comme un amoureux',
    ru: 'Объясняй мечтательно, как влюблённый',
  } },

  // Roles
  { id: 'news', group: 'roles', text: {
    ro: 'Ești prezentator de știri la televizor',
    en: "You're a TV news presenter",
    es: 'Eres presentador de noticias en la tele',
    fr: 'Tu es présentateur du journal télévisé',
    ru: 'Ты ведущий теленовостей',
  } },
  { id: 'robot', group: 'roles', text: {
    ro: 'Ești un robot: vorbește sacadat, fără emoții',
    en: "You're a robot: speak in a flat, choppy voice",
    es: 'Eres un robot: habla entrecortado y sin emoción',
    fr: 'Tu es un robot : parle de façon saccadée, sans émotion',
    ru: 'Ты робот: говори отрывисто и без эмоций',
  } },
  { id: 'opera', group: 'roles', text: {
    ro: 'Cântă explicațiile ca un cântăreț de operă',
    en: 'Sing your clues like an opera singer',
    es: 'Canta las pistas como un cantante de ópera',
    fr: 'Chante tes indices comme un chanteur d\'opéra',
    ru: 'Пой подсказки, как оперный певец',
  } },
  { id: 'guide', group: 'roles', text: {
    ro: 'Ești ghid turistic și prezinți fiecare cuvânt ca pe o atracție',
    en: "You're a tour guide presenting each word as a landmark",
    es: 'Eres guía turístico y presentas cada palabra como un monumento',
    fr: 'Tu es guide touristique et présentes chaque mot comme un monument',
    ru: 'Ты экскурсовод и представляешь каждое слово как достопримечательность',
  } },
  { id: 'chef', group: 'roles', text: {
    ro: 'Ești bucătar la o emisiune TV și „gătești” fiecare cuvânt',
    en: "You're a TV chef \"cooking up\" every word",
    es: 'Eres chef de un programa de TV y "cocinas" cada palabra',
    fr: 'Tu es chef dans une émission de télé et « cuisines » chaque mot',
    ru: 'Ты шеф-повар телешоу и «готовишь» каждое слово',
  } },
  { id: 'coach', group: 'roles', text: {
    ro: 'Ești antrenor de fitness și strigi încurajări',
    en: "You're a fitness coach shouting encouragement",
    es: 'Eres entrenador de fitness y gritas palabras de ánimo',
    fr: 'Tu es coach sportif et cries des encouragements',
    ru: 'Ты фитнес-тренер и выкрикиваешь подбадривания',
  } },
  { id: 'storyteller', group: 'roles', text: {
    ro: 'Ești bunicul care spune o poveste la gura sobei',
    en: "You're a grandparent telling a bedtime story",
    es: 'Eres el abuelo que cuenta un cuento junto a la chimenea',
    fr: 'Tu es le grand-parent qui raconte une histoire au coin du feu',
    ru: 'Ты дедушка, рассказывающий сказку у камина',
  } },

  // Movements
  { id: 'one-foot', group: 'moves', text: {
    ro: 'Explică stând într-un picior',
    en: 'Explain while standing on one foot',
    es: 'Explica sobre un solo pie',
    fr: 'Explique en te tenant sur un pied',
    ru: 'Объясняй, стоя на одной ноге',
  } },
  { id: 'hands-back', group: 'moves', text: {
    ro: 'Ține mâinile la spate tot timpul',
    en: 'Keep your hands behind your back the whole time',
    es: 'Mantén las manos a la espalda todo el tiempo',
    fr: 'Garde les mains dans le dos tout le temps',
    ru: 'Всё время держи руки за спиной',
  } },
  { id: 'walk-circle', group: 'moves', text: {
    ro: 'Explică în timp ce te plimbi în cerc',
    en: 'Explain while walking in a circle',
    es: 'Explica mientras caminas en círculo',
    fr: 'Explique en marchant en rond',
    ru: 'Объясняй, шагая по кругу',
  } },
  { id: 'eyes-closed', group: 'moves', text: {
    ro: 'Citește cuvântul, apoi explică cu ochii închiși',
    en: 'Read the word, then explain with your eyes closed',
    es: 'Lee la palabra y luego explícala con los ojos cerrados',
    fr: 'Lis le mot, puis explique les yeux fermés',
    ru: 'Прочитай слово, затем объясняй с закрытыми глазами',
  } },
  { id: 'nose-touch', group: 'moves', text: {
    ro: 'Atinge-ți nasul după fiecare cuvânt ghicit',
    en: 'Touch your nose after every guessed word',
    es: 'Tócate la nariz después de cada palabra adivinada',
    fr: 'Touche ton nez après chaque mot deviné',
    ru: 'Касайся носа после каждого угаданного слова',
  } },
  { id: 'clap', group: 'moves', text: {
    ro: 'Bate din palme o dată înainte de fiecare cuvânt nou',
    en: 'Clap once before each new word',
    es: 'Da una palmada antes de cada palabra nueva',
    fr: 'Tape une fois dans tes mains avant chaque nouveau mot',
    ru: 'Хлопай один раз перед каждым новым словом',
  } },
  { id: 'hand-head', group: 'moves', text: {
    ro: 'Ține o mână pe cap toată runda',
    en: 'Keep one hand on your head for the whole round',
    es: 'Mantén una mano en la cabeza toda la ronda',
    fr: 'Garde une main sur la tête pendant toute la manche',
    ru: 'Держи одну руку на голове весь раунд',
  } },

  // Special rules
  { id: 'slow', group: 'special', text: {
    ro: 'Vorbește foarte, foarte încet',
    en: 'Speak very, very slowly',
    es: 'Habla muy, muy despacio',
    fr: 'Parle très, très lentement',
    ru: 'Говори очень-очень медленно',
  } },
  { id: 'questions', group: 'special', text: {
    ro: 'Explică doar prin întrebări',
    en: 'Explain using only questions',
    es: 'Explica solo con preguntas',
    fr: 'Explique uniquement avec des questions',
    ru: 'Объясняй только вопросами',
  } },
  { id: 'three-words', group: 'special', text: {
    ro: 'Maximum trei cuvinte pentru fiecare indiciu',
    en: 'At most three words per clue',
    es: 'Como máximo tres palabras por pista',
    fr: 'Trois mots maximum par indice',
    ru: 'Не больше трёх слов на подсказку',
  } },
  { id: 'no-gestures', group: 'special', text: {
    ro: 'Fără gesturi: ține mâinile în buzunare',
    en: 'No gestures: keep your hands in your pockets',
    es: 'Sin gestos: mantén las manos en los bolsillos',
    fr: 'Pas de gestes : garde les mains dans les poches',
    ru: 'Без жестов: держи руки в карманах',
  } },
  { id: 'colour', group: 'special', text: {
    ro: 'Fiecare indiciu trebuie să conțină o culoare',
    en: 'Every clue must mention a colour',
    es: 'Cada pista debe mencionar un color',
    fr: 'Chaque indice doit mentionner une couleur',
    ru: 'В каждой подсказке должен быть цвет',
  } },
  { id: 'number', group: 'special', text: {
    ro: 'Fiecare indiciu trebuie să conțină un număr',
    en: 'Every clue must include a number',
    es: 'Cada pista debe incluir un número',
    fr: 'Chaque indice doit contenir un nombre',
    ru: 'В каждой подсказке должно быть число',
  } },
  { id: 'rhyme', group: 'special', text: {
    ro: 'Încearcă să explici în rime',
    en: 'Try to explain in rhymes',
    es: 'Intenta explicar con rimas',
    fr: 'Essaie d\'expliquer en rimes',
    ru: 'Постарайся объяснять в рифму',
  } },
];

export interface ActiveTask {
  id: string;
  group: TaskGroup | 'custom';
  text: string;
}

/** Tasks the players left switched on, plus their own, in the current language. */
export const getTaskPool = (
  language: Language,
  disabledIds: string[] = [],
  custom: CustomTask[] = []
): ActiveTask[] => [
  ...TASKS.filter((task) => !disabledIds.includes(task.id)).map((task) => ({
    id: task.id,
    group: task.group,
    text: task.text[language],
  })),
  ...custom
    .filter((task) => task.text.trim().length > 0 && !disabledIds.includes(task.id))
    .map((task) => ({ id: task.id, group: 'custom' as const, text: task.text.trim() })),
];

/**
 * Decides whether a round gets a task, and which one. Avoids repeating the
 * previous task when there is another to choose from.
 */
export const pickTask = (
  pool: ActiveTask[],
  frequency: TaskFrequency,
  previousId?: string | null,
  random: () => number = Math.random
): ActiveTask | null => {
  const chance = TASK_FREQUENCY_CHANCE[frequency] ?? 0;
  if (pool.length === 0 || chance === 0) return null;
  if (chance < 1 && random() >= chance) return null;
  const choices = pool.length > 1 ? pool.filter((task) => task.id !== previousId) : pool;
  return choices[Math.floor(random() * choices.length)] ?? null;
};
