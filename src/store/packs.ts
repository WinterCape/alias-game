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
    name: { ro: 'Petrecere 18+', en: 'Party 18+' },
    description: {
      ro: 'Cuvinte picante pentru adulți. Umor, aluzii și distracție fără limite!',
      en: 'Spicy words for adults. Humor, innuendos and unlimited fun!',
    },
    icon: 'glass-cocktail',
    color: '#E91E63',
    price: '$0.99',
    productId: 'com.aliasquest.pack.party18',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
  {
    id: 'popculture',
    name: { ro: 'Cultură Pop', en: 'Pop Culture' },
    description: {
      ro: 'Celebrități, meme-uri, tendințe virale și tot ce e la modă!',
      en: 'Celebrities, memes, viral trends and everything trending!',
    },
    icon: 'star-shooting',
    color: '#FF9800',
    price: '$0.99',
    productId: 'com.aliasquest.pack.popculture',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
  {
    id: 'mythology',
    name: { ro: 'Mitologie & Legende', en: 'Mythology & Legends' },
    description: {
      ro: 'Zei, creaturi mitice, eroi legendari și povești epice din toate culturile!',
      en: 'Gods, mythical creatures, legendary heroes and epic tales from all cultures!',
    },
    icon: 'chess-knight',
    color: '#9C27B0',
    price: '$0.99',
    productId: 'com.aliasquest.pack.mythology',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
  {
    id: 'science',
    name: { ro: 'Știință & Medicină', en: 'Science & Medicine' },
    description: {
      ro: 'Termeni științifici, descoperiri medicale și vocabular specializat!',
      en: 'Scientific terms, medical discoveries and specialized vocabulary!',
    },
    icon: 'flask',
    color: '#00BCD4',
    price: '$0.99',
    productId: 'com.aliasquest.pack.science',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
  {
    id: 'business',
    name: { ro: 'Business & Finanțe', en: 'Business & Finance' },
    description: {
      ro: 'Jargon corporatist, termeni de startup și lumea afacerilor!',
      en: 'Corporate jargon, startup terms and the business world!',
    },
    icon: 'briefcase',
    color: '#607D8B',
    price: '$0.99',
    productId: 'com.aliasquest.pack.business',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
  {
    id: 'traditions',
    name: { ro: 'Tradiții Românești', en: 'Romanian Traditions' },
    description: {
      ro: 'Obiceiuri, sărbători, meșteșuguri și patrimoniu cultural românesc!',
      en: 'Customs, holidays, crafts and Romanian cultural heritage!',
    },
    icon: 'flower-tulip',
    color: '#4CAF50',
    price: '$0.99',
    productId: 'com.aliasquest.pack.traditions',
    wordCount: { ro: 120, en: 120 },
    isFree: false,
  },
];

export const ALL_ACCESS_PRODUCT_ID = 'com.aliasquest.allaccess';
export const ALL_ACCESS_PRICE = '$4.99';
