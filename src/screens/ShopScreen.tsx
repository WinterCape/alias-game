import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useI18n } from '../i18n/I18nContext';
import { useStore } from '../store/StoreContext';
import { PREMIUM_PACKS, ALL_ACCESS_PRICE, PackId } from '../store/packs';
import { PurchaseResult } from '../store/storeMode';
import { useProgression } from '../progression/ProgressionContext';
import { isPackUnlockedByLevel, getPackUnlockLevel } from '../progression/rewards';

export const ShopScreen = ({ navigation }: any) => {
  const { lang, t } = useI18n();
  const {
    isPurchased,
    purchasePack,
    purchaseAllAccess,
    restorePurchases,
    hasAllAccess,
  } = useStore();
  const { level } = useProgression();

  // Tell the player when a purchase or restore did not go through
  const showResult = (result: PurchaseResult, successMessage?: string) => {
    if (result === 'unavailable') {
      Alert.alert(t.shopUnavailableTitle, t.shopUnavailableMessage);
    } else if (result === 'failed') {
      Alert.alert(t.purchaseFailedTitle, t.purchaseFailedMessage);
    } else if (result === 'success' && successMessage) {
      Alert.alert(successMessage);
    }
  };

  const handlePurchasePack = async (packId: PackId) => showResult(await purchasePack(packId));
  const handlePurchaseAllAccess = async () => showResult(await purchaseAllAccess());
  const handleRestore = async () => showResult(await restorePurchases(), t.purchasesRestored);

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
          {t.heroShop}
        </Text>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
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
          onPress={hasAllAccess ? undefined : handlePurchaseAllAccess}
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
                    {t.allAccess}
                  </Text>
                  <Text style={styles.allAccessDesc}>
                    {t.allAccessDesc}
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
                  {t.allAccess}
                </Text>
                <Text style={styles.allAccessDescPurchased}>
                  {t.allAccessOwned}
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
            {t.wordPacks}
          </Text>
          <View style={styles.sectionDividerLine} />
        </View>

        {/* Pack List */}
        {PREMIUM_PACKS.map((pack) => {
          const purchased = isPurchased(pack.id);
          const levelUnlocked = isPackUnlockedByLevel(pack.id, level);
          const unlockLevel = getPackUnlockLevel(pack.id);
          const isAvailable = purchased || levelUnlocked;

          return (
            <View
              key={pack.id}
              style={[styles.packCard, isAvailable && styles.packCardPurchased]}
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
                    {t.wordsUnit}
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
                        {t.packUnlocked}
                      </Text>
                    </View>
                  ) : levelUnlocked ? (
                    <View style={styles.levelUnlockedBadge}>
                      <MaterialCommunityIcons
                        name="shield-star"
                        size={14}
                        color="#fff"
                      />
                      <Text style={styles.levelUnlockedText}>
                        {`${t.levelShort} ${unlockLevel}`}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.packActionStack}>
                      <TouchableOpacity
                        style={styles.priceButton}
                        onPress={() => handlePurchasePack(pack.id)}
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
                      {unlockLevel !== null && (
                        <Text style={styles.orLevelText}>
                          {`${t.orLevel} ${unlockLevel}`}
                        </Text>
                      )}
                    </View>
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

  // Level Unlocked Badge
  levelUnlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2d8a4e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelUnlockedText: {
    fontFamily: FONTS.bodyBold,
    fontSize: SIZES.xs,
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Pack action stack (price + "or Level X")
  packActionStack: {
    alignItems: 'center',
  },
  orLevelText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  bottomSpacer: {
    height: 40,
  },
});
