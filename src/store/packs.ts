import { Language } from '../i18n/strings';

export type PackId = 'party18' | 'popculture' | 'mythology' | 'science' | 'business' | 'traditions';

export interface WordPack {
  id: PackId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  color: string;
  price: string;
  productId: string;
  wordCount: Record<Language, number>;
  isFree: boolean;
}

export const PREMIUM_PACKS: WordPack[] = [
  {
    id: 'party18',
    name: { ro: 'Petrecere 18+', en: 'Party 18+', es: 'Fiesta 18+', fr: 'Fête 18+', ru: 'Вечеринка 18+' },
    description: {
      ro: 'Cuvinte picante pentru adulți. Umor, aluzii și distracție fără limite!',
      en: 'Spicy words for adults. Humor, innuendos and unlimited fun!',
      es: '¡Palabras picantes para adultos. Humor, insinuaciones y diversión sin límites!',
      fr: 'Mots piquants pour adultes. Humour, allusions et amusement sans limites !',
      ru: 'Острые слова для взрослых. Юмор, намёки и безграничное веселье!',
    },
    icon: 'glass-cocktail',
    color: '#E91E63',
    price: '$0.99',
    productId: 'com.aliasquest.pack.party18',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
  {
    id: 'popculture',
    name: { ro: 'Cultură Pop', en: 'Pop Culture', es: 'Cultura Pop', fr: 'Culture Pop', ru: 'Поп-культура' },
    description: {
      ro: 'Celebrități, meme-uri, tendințe virale și tot ce e la modă!',
      en: 'Celebrities, memes, viral trends and everything trending!',
      es: '¡Celebridades, memes, tendencias virales y todo lo que está de moda!',
      fr: 'Célébrités, mèmes, tendances virales et tout ce qui est à la mode !',
      ru: 'Знаменитости, мемы, вирусные тренды и всё, что в моде!',
    },
    icon: 'star-shooting',
    color: '#FF9800',
    price: '$0.99',
    productId: 'com.aliasquest.pack.popculture',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
  {
    id: 'mythology',
    name: { ro: 'Mitologie & Legende', en: 'Mythology & Legends', es: 'Mitología y Leyendas', fr: 'Mythologie & Légendes', ru: 'Мифология и Легенды' },
    description: {
      ro: 'Zei, creaturi mitice, eroi legendari și povești epice din toate culturile!',
      en: 'Gods, mythical creatures, legendary heroes and epic tales from all cultures!',
      es: '¡Dioses, criaturas míticas, héroes legendarios y relatos épicos de todas las culturas!',
      fr: 'Dieux, créatures mythiques, héros légendaires et récits épiques de toutes les cultures !',
      ru: 'Боги, мифические существа, легендарные герои и эпические сказания всех культур!',
    },
    icon: 'chess-knight',
    color: '#9C27B0',
    price: '$0.99',
    productId: 'com.aliasquest.pack.mythology',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
  {
    id: 'science',
    name: { ro: 'Știință & Medicină', en: 'Science & Medicine', es: 'Ciencia y Medicina', fr: 'Science & Médecine', ru: 'Наука и Медицина' },
    description: {
      ro: 'Termeni științifici, descoperiri medicale și vocabular specializat!',
      en: 'Scientific terms, medical discoveries and specialized vocabulary!',
      es: '¡Términos científicos, descubrimientos médicos y vocabulario especializado!',
      fr: 'Termes scientifiques, découvertes médicales et vocabulaire spécialisé !',
      ru: 'Научные термины, медицинские открытия и специализированная лексика!',
    },
    icon: 'flask',
    color: '#00BCD4',
    price: '$0.99',
    productId: 'com.aliasquest.pack.science',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
  {
    id: 'business',
    name: { ro: 'Business & Finanțe', en: 'Business & Finance', es: 'Negocios y Finanzas', fr: 'Business & Finance', ru: 'Бизнес и Финансы' },
    description: {
      ro: 'Jargon corporatist, termeni de startup și lumea afacerilor!',
      en: 'Corporate jargon, startup terms and the business world!',
      es: '¡Jerga corporativa, términos de startup y el mundo de los negocios!',
      fr: 'Jargon d\'entreprise, termes de startup et le monde des affaires !',
      ru: 'Корпоративный жаргон, стартап-термины и мир бизнеса!',
    },
    icon: 'briefcase',
    color: '#607D8B',
    price: '$0.99',
    productId: 'com.aliasquest.pack.business',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
  {
    id: 'traditions',
    name: { ro: 'Tradiții Românești', en: 'Romanian Traditions', es: 'Tradiciones Rumanas', fr: 'Traditions Roumaines', ru: 'Румынские Традиции' },
    description: {
      ro: 'Obiceiuri, sărbători, meșteșuguri și patrimoniu cultural românesc!',
      en: 'Customs, holidays, crafts and Romanian cultural heritage!',
      es: '¡Costumbres, fiestas, artesanías y patrimonio cultural rumano!',
      fr: 'Coutumes, fêtes, artisanats et patrimoine culturel roumain !',
      ru: 'Обычаи, праздники, ремёсла и культурное наследие Румынии!',
    },
    icon: 'flower-tulip',
    color: '#4CAF50',
    price: '$0.99',
    productId: 'com.aliasquest.pack.traditions',
    wordCount: { ro: 120, en: 120, es: 120, fr: 120, ru: 120 },
    isFree: false,
  },
];

export const ALL_ACCESS_PRODUCT_ID = 'com.aliasquest.allaccess';
export const ALL_ACCESS_PRICE = '$4.99';
