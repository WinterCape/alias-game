import { Language } from '../i18n/strings';

const FUNNY_NAMES: Record<Language, string[]> = {
  ro: [
    'Țestoasele Bete', 'Bizonii Leneși', 'Pinguinii Dansatori', 'Ratonii Nebuni',
    'Unicornii Beți', 'Șoricei Furioși', 'Hipopotamii Grăbiți', 'Dropiile Elegante',
    'Canguri cu Ochelari', 'Vulpile Șmechere', 'Cămilele Vesele', 'Rațele Filosofe',
    'Porcii Zburători', 'Capre pe Skateboard', 'Flamingo Rockeri', 'Melcii Turbo',
    'Broscuțe Ninja', 'Papagali Detektivi', 'Bufnițe Rebel', 'Veverițe Pirate',
    'Aricii Romantici', 'Struți cu Atitudine', 'Peștii Înțelepți', 'Oițe Extreme',
    'Castori Dansatori', 'Leneșii Rapizi', 'Ciocanitori de Noapte', 'Urși de Pluș',
    'Pisici Spartane', 'Găini Cosmice', 'Curci Volante', 'Vaci în Vacanță',
  ],
  en: [
    'Drunk Turtles', 'Lazy Bisons', 'Dancing Penguins', 'Crazy Raccoons',
    'Tipsy Unicorns', 'Furious Mice', 'Rushing Hippos', 'Elegant Ostriches',
    'Nerdy Kangaroos', 'Sneaky Foxes', 'Happy Camels', 'Philosopher Ducks',
    'Flying Pigs', 'Skateboard Goats', 'Rockstar Flamingos', 'Turbo Snails',
    'Ninja Frogs', 'Detective Parrots', 'Rebel Owls', 'Pirate Squirrels',
    'Romantic Hedgehogs', 'Sassy Ostriches', 'Wise Fish', 'Extreme Sheep',
    'Dancing Beavers', 'Speedy Sloths', 'Night Woodpeckers', 'Teddy Bears',
    'Spartan Cats', 'Cosmic Chickens', 'Astral Turkeys', 'Vacationing Cows',
  ],
  es: [
    'Tortugas Borrachas', 'Bisontes Perezosos', 'Pingüinos Bailarines', 'Mapaches Locos',
    'Unicornios Alegres', 'Ratones Furiosos', 'Hipopótamos Apurados', 'Avestruces Elegantes',
    'Canguros con Gafas', 'Zorros Astutos', 'Camellos Felices', 'Patos Filósofos',
    'Cerdos Voladores', 'Cabras en Patineta', 'Flamencos Rockeros', 'Caracoles Turbo',
    'Ranas Ninja', 'Loros Detectives', 'Búhos Rebeldes', 'Ardillas Piratas',
    'Erizos Románticos', 'Avestruces Sarcásticos', 'Peces Sabios', 'Ovejas Extremas',
    'Castores Bailarines', 'Perezosos Veloces', 'Pájaros Nocturnos', 'Osos de Peluche',
    'Gatos Espartanos', 'Gallinas Cósmicas', 'Pavos Voladores', 'Vacas de Vacaciones',
  ],
  fr: [
    'Tortues Ivres', 'Bisons Paresseux', 'Pingouins Danseurs', 'Ratons Fous',
    'Licornes Joyeuses', 'Souris Furieuses', 'Hippos Pressés', 'Autruches Élégantes',
    'Kangourous à Lunettes', 'Renards Malins', 'Chameaux Heureux', 'Canards Philosophes',
    'Cochons Volants', 'Chèvres en Skate', 'Flamants Rockeurs', 'Escargots Turbo',
    'Grenouilles Ninja', 'Perroquets Détectives', 'Hiboux Rebelles', 'Écureuils Pirates',
    'Hérissons Romantiques', 'Autruches Insolentes', 'Poissons Sages', 'Moutons Extrêmes',
    'Castors Danseurs', 'Paresseux Rapides', 'Pics Nocturnes', 'Ours en Peluche',
    'Chats Spartiates', 'Poules Cosmiques', 'Dindes Volantes', 'Vaches en Vacances',
  ],
  ru: [
    'Пьяные Черепахи', 'Ленивые Бизоны', 'Танцующие Пингвины', 'Безумные Еноты',
    'Весёлые Единороги', 'Яростные Мыши', 'Торопливые Бегемоты', 'Элегантные Страусы',
    'Кенгуру в Очках', 'Хитрые Лисы', 'Счастливые Верблюды', 'Утки-Философы',
    'Летающие Свиньи', 'Козы на Скейтборде', 'Фламинго-Рокеры', 'Турбо Улитки',
    'Лягушки-Ниндзя', 'Попугаи-Детективы', 'Совы-Бунтари', 'Белки-Пираты',
    'Романтичные Ежи', 'Дерзкие Страусы', 'Мудрые Рыбы', 'Экстремальные Овцы',
    'Танцующие Бобры', 'Быстрые Ленивцы', 'Ночные Дятлы', 'Плюшевые Медведи',
    'Спартанские Коты', 'Космические Курицы', 'Астральные Индейки', 'Коровы в Отпуске',
  ],
};

export const generateFunnyTeamNames = (
  count: number,
  language: Language
): string[] => {
  const pool = [...FUNNY_NAMES[language]];
  const names: string[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    names.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return names;
};
