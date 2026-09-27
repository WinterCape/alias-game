import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { useStore } from '../store/StoreContext';
import { PREMIUM_PACKS, ALL_ACCESS_PRICE } from '../store/packs';

export const ShopScreen = ({ navigation }: any) => {
  const { lang } = useI18n();
  const {
    isPurchased,
    purchasePack,
    purchaseAllAccess,
    restorePurchases,
    hasAllAccess,
  } = useStore();

  return (
    <LinearGradient
      colors={['#0D0A1A', '#161230', '#0D0A1A']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={COLORS.gold}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {lang === 'ro' ? 'Magazinul Eroilor' : "Hero's Shop"}
        </Text>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={restorePurchases}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={22}
            color={COLORS.gold}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* All Access Banner */}
        <TouchableOpacity
          style={[
            styles.allAccessCard,
            hasAllAccess && styles.allAccessCardPurchased,
          ]}
          onPress={hasAllAccess ? undefined : purchaseAllAccess}
          activeOpacity={hasAllAccess ? 1 : 0.8}
          disabled={hasAllAccess}
        >
          {!hasAllAccess ? (
            <LinearGradient
              colors={['#8B6914', '#D4A853', '#F0C75E', '#D4A853', '#8B6914']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.allAccessGradient}
            >
              <View style={styles.allAccessContent}>
                <View style={styles.allAccessIconWrap}>
                  <MaterialCommunityIcons
                    name="crown"
                    size={32}
                    color={COLORS.ink}
                  />
                </View>
                <View style={styles.allAccessTextWrap}>
                  <Text style={styles.allAccessTitle}>
                    {lang === 'ro' ? 'Acces Total' : 'All Access'}
                  </Text>
                  <Text style={styles.allAccessDesc}>
                    {lang === 'ro'
                      ? 'Deblocheaza toate pachetele de cuvinte'
                      : 'Unlock all word packs'}
                  </Text>
                </View>
                <View style={styles.allAccessPriceBadge}>
                  <Text style={styles.allAccessPriceText}>
                    {ALL_ACCESS_PRICE}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.allAccessContent}>
              <View style={styles.allAccessIconWrapPurchased}>
                <MaterialCommunityIcons
                  name="crown"
                  size={32}
                  color={COLORS.gold}
                />
              </View>
              <View style={styles.allAccessTextWrap}>
                <Text style={styles.allAccessTitlePurchased}>
                  {lang === 'ro' ? 'Acces Total' : 'All Access'}
                </Text>
                <Text style={styles.allAccessDescPurchased}>
                  {lang === 'ro'
                    ? 'Toate pachetele sunt deblocate!'
                    : 'All packs are unlocked!'}
                </Text>
              </View>
              <View style={styles.allAccessCheckBadge}>
                <MaterialCommunityIcons
                  name="check-bold"
                  size={20}
                  color="#fff"
                />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.sectionDivider}>
          <View style={styles.sectionDividerLine} />
          <Text style={styles.sectionDividerText}>
            {lang === 'ro' ? 'Pachete de Cuvinte' : 'Word Packs'}
          </Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Pack List */}
        {PREMIUM_PACKS.map((pack) => {
          const purchased = isPurchased(pack.id);

          return (
            <View
              key={pack.id}
              style={[styles.packCard, purchased && styles.packCardPurchased]}
            >
              <View style={styles.packRow}>
                <View
                  style={[
                    styles.packIconCircle,
                    { backgroundColor: pack.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={pack.icon as any}
                    size={26}
                    color={pack.color}
                  />
                </View>

                <View style={styles.packInfo}>
                  <Text style={styles.packName}>{pack.name[lang]}</Text>
                  <Text style={styles.packDesc} numberOfLines={2}>
                    {pack.description[lang]}
                  </Text>
                  <Text style={styles.packWordCount}>
                    {pack.wordCount[lang]}{' '}
                    {lang === 'ro' ? 'cuvinte' : 'words'}
                  </Text>
                </View>

                <View style={styles.packAction}>
                  {purchased ? (
                    <View style={styles.unlockedBadge}>
                      <MaterialCommunityIcons
                        name="check-bold"
                        size={14}
                        color="#fff"
                      />
                      <Text style={styles.unlockedText}>
                        {lang === 'ro' ? 'Deblocat' : 'Unlocked'}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.priceButton}
                      onPress={() => purchasePack(pack.id)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#8B6914', '#D4A853', '#8B6914']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.priceButtonGradient}
                      >
                        <Text style={styles.priceButtonText}>
                          {pack.price}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
    backgroundColor: 'rgba(212,168,83,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.displayBlack,
    fontSize: SIZES.xl,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  restoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.3)',
    backgroundColor: 'rgba(212,168,83,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
  },

  // All Access Banner
  allAccessCard: {
    borderRadius: SIZES.cardRadius,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.gold,
    elevation: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  allAccessCardPurchased: {
    borderColor: 'rgba(212,168,83,0.3)',
    backgroundColor: 'rgba(45,106,79,0.08)',
    elevation: 0,
    shadowOpacity: 0,
  },
  allAccessGradient: {
    padding: 20,
  },
  allAccessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  allAccessIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(44,24,16,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allAccessIconWrapPurchased: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allAccessTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  allAccessTitle: {
    fontFamily: FONTS.displayBlack,
    fontSize: SIZES.lg,
    color: COLORS.ink,
    letterSpacing: 1,
  },
  allAccessTitlePurchased: {
    fontFamily: FONTS.displayBlack,
    fontSize: SIZES.lg,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  allAccessDesc: {
    fontFamily: FONTS.body,
    fontSize: SIZES.sm,
    color: COLORS.inkSoft,
    marginTop: 2,
  },
  allAccessDescPurchased: {
    fontFamily: FONTS.body,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  allAccessPriceBadge: {
    backgroundColor: 'rgba(44,24,16,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  allAccessPriceText: {
    fontFamily: FONTS.bodyBlack,
    fontSize: SIZES.md,
    color: COLORS.ink,
  },
  allAccessCheckBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.correct,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Divider
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.goldDim,
    opacity: 0.3,
  },
  sectionDividerText: {
    fontFamily: FONTS.display,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Pack Cards
  packCard: {
    backgroundColor: 'rgba(212,168,83,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.1)',
    borderRadius: SIZES.cardRadius,
    marginBottom: 12,
    padding: 16,
  },
  packCardPurchased: {
    backgroundColor: 'rgba(45,106,79,0.08)',
    borderColor: 'rgba(45,106,79,0.2)',
  },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  packName: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.lg,
    color: COLORS.text,
  },
  packDesc: {
    fontFamily: FONTS.body,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  packWordCount: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.xs,
    color: COLORS.goldDim,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  packAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Price Button
  priceButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  priceButtonGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceButtonText: {
    fontFamily: FONTS.bodyBlack,
    fontSize: SIZES.md,
    color: COLORS.ink,
  },

  // Unlocked Badge
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.correct,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unlockedText: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.xs,
    color: '#fff',
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: 40,
  },
});
