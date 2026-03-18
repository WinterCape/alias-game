import { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'general', name: 'General', icon: 'star', color: '#6C63FF' },
  { id: 'animale', name: 'Animale', icon: 'paw', color: '#FF9F43' },
  { id: 'mancare', name: 'Mâncare', icon: 'food-apple', color: '#EE5A24' },
  { id: 'sporturi', name: 'Sporturi', icon: 'soccer', color: '#43E97B' },
  { id: 'profesii', name: 'Profesii', icon: 'briefcase', color: '#5F27CD' },
  { id: 'natura', name: 'Natură', icon: 'tree', color: '#10AC84' },
  { id: 'tehnologie', name: 'Tehnologie', icon: 'laptop', color: '#54A0FF' },
  { id: 'filme', name: 'Filme & TV', icon: 'movie', color: '#C44569' },
  { id: 'muzica', name: 'Muzică', icon: 'music', color: '#E056A0' },
  { id: 'istorie', name: 'Istorie', icon: 'castle', color: '#8B7355' },
  { id: 'geografie', name: 'Geografie', icon: 'earth', color: '#0ABDE3' },
  { id: 'scoala', name: 'Școală', icon: 'school', color: '#F368E0' },
  { id: 'casa', name: 'Casă', icon: 'home', color: '#FF6348' },
  { id: 'emotii', name: 'Emoții', icon: 'emoticon', color: '#FECA57' },
  { id: 'haine', name: 'Haine', icon: 'tshirt-crew', color: '#9B59B6' },
];

export const getCategoryById = (id: CategoryId): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
