import React from 'react';
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';

// A word card styled like a tarot "arcana": dark face, gold double frame,
// star corners, the realm's emblem on top and its name at the bottom.

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export const toRoman = (n: number): string => {
  let rest = Math.max(0, Math.floor(n));
  let out = '';
  for (const [value, numeral] of ROMAN) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out;
};

export interface ArcanaRealm {
  name: string;
  icon: string;
  color: string;
}

interface ArcanaCardProps {
  word: string;
  realm?: ArcanaRealm | null;
  // Frame colour: gold in Arena, blue in Aventura
  accent?: string;
  // Shown as a Roman numeral next to the realm name
  number?: number;
  // Outer style, may be animated (swipe transform, border colour)
  style?: StyleProp<any>;
  minHeight?: number;
  children?: React.ReactNode;
}

const Star = ({ color, style }: { color: string; style: StyleProp<ViewStyle> }) => (
  <Text style={[styles.star, { color }, style]}>✦</Text>
);

export const ArcanaCard = ({
  word,
  realm,
  accent = COLORS.gold,
  number,
  style,
  minHeight = 260,
  children,
}: ArcanaCardProps) => {
  const footer = [realm?.name?.toUpperCase(), number ? toRoman(number) : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Animated.View style={[styles.card, { borderColor: accent, minHeight }, style]}>
      <View style={[styles.innerFrame, { borderColor: accent + '66' }]}>
        <Star color={accent} style={styles.starTL} />
        <Star color={accent} style={styles.starTR} />
        <Star color={accent} style={styles.starBL} />
        <Star color={accent} style={styles.starBR} />

        {realm && (
          <View style={[styles.emblem, { borderColor: accent, backgroundColor: realm.color + '22' }]}>
            <MaterialCommunityIcons name={realm.icon as any} size={24} color={realm.color} />
          </View>
        )}

        <View style={styles.wordBlock}>
          <View style={styles.rule}>
            <View style={[styles.ruleLine, { backgroundColor: accent + '66' }]} />
            <Text style={[styles.diamond, { color: accent }]}>◆</Text>
            <View style={[styles.ruleLine, { backgroundColor: accent + '66' }]} />
          </View>
          <Text
            style={styles.word}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            accessibilityRole="header"
          >
            {word}
          </Text>
          <View style={styles.rule}>
            <View style={[styles.ruleLine, { backgroundColor: accent + '66' }]} />
            <Text style={[styles.diamond, { color: accent }]}>◆</Text>
            <View style={[styles.ruleLine, { backgroundColor: accent + '66' }]} />
          </View>
          {children}
        </View>

        {!!footer && <Text style={[styles.footer, { color: accent }]}>{footer}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#1A1530',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 7,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  star: {
    position: 'absolute',
    fontSize: 13,
  },
  starTL: { top: 6, left: 9 },
  starTR: { top: 6, right: 9 },
  starBL: { bottom: 6, left: 9 },
  starBR: { bottom: 6, right: 9 },
  emblem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    gap: 8,
  },
  ruleLine: {
    flex: 1,
    height: 1,
  },
  diamond: {
    fontSize: 8,
  },
  word: {
    fontFamily: FONTS.displayBlack,
    fontSize: 40,
    color: COLORS.parchment,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    letterSpacing: 3,
    textAlign: 'center',
  },
});
