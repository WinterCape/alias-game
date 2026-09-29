import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PackId, PREMIUM_PACKS, ALL_ACCESS_PRODUCT_ID } from './packs';
import { getFallbackStoreMode, getStoreMode, PurchaseResult, StoreMode } from './storeMode';

const PURCHASES_KEY = '@alias_quest_purchases';
const RC_API_KEY_IOS = 'YOUR_REVENUECAT_IOS_KEY';
const RC_API_KEY_ANDROID = 'YOUR_REVENUECAT_ANDROID_KEY';

interface PurchaseState {
  unlockedPacks: PackId[];
  hasAllAccess: boolean;
  isLoading: boolean;
}

interface StoreContextType extends PurchaseState {
  isPurchased: (packId: PackId) => boolean;
  purchasePack: (packId: PackId) => Promise<PurchaseResult>;
  purchaseAllAccess: () => Promise<PurchaseResult>;
  restorePurchases: () => Promise<PurchaseResult>;
}

const StoreContext = createContext<StoreContextType | null>(null);

let Purchases: any = null;
let rcInitialized = false;
let storeMode: StoreMode = getFallbackStoreMode(__DEV__);

const initRevenueCat = async () => {
  if (rcInitialized) return;
  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  storeMode = getStoreMode(apiKey, __DEV__);
  if (storeMode !== 'live') return;
  try {
    const rc = require('react-native-purchases');
    Purchases = rc.default || rc;
    await Purchases.configure({ apiKey });
    rcInitialized = true;
  } catch {
    // RevenueCat could not start: simulate in development, never unlock for free in release
    storeMode = getFallbackStoreMode(__DEV__);
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PurchaseState>({
    unlockedPacks: [],
    hasAllAccess: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = async () => {
      await initRevenueCat();

      // Load local purchase state
      try {
        const saved = await AsyncStorage.getItem(PURCHASES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            unlockedPacks: parsed.unlockedPacks || [],
            hasAllAccess: parsed.hasAllAccess || false,
            isLoading: false,
          });
          return;
        }
      } catch {}

      // If RevenueCat is initialized, sync from server
      if (rcInitialized && Purchases) {
        try {
          const info = await Purchases.getCustomerInfo();
          const packs: PackId[] = [];
          let allAccess = false;

          PREMIUM_PACKS.forEach((pack) => {
            if (info.entitlements.active[pack.id]) {
              packs.push(pack.id);
            }
          });

          if (info.entitlements.active['all_access']) {
            allAccess = true;
          }

          const newState = { unlockedPacks: packs, hasAllAccess: allAccess, isLoading: false };
          setState(newState);
          await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(newState));
          return;
        } catch {}
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    };

    init();
  }, []);

  // Latest state for async purchase handlers, which outlive the render they started in
  const stateRef = useRef(state);
  stateRef.current = state;

  const savePurchases = useCallback(async (packs: PackId[], allAccess: boolean) => {
    const data = { unlockedPacks: packs, hasAllAccess: allAccess };
    await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(data)).catch(() => {});
  }, []);

  const isPurchased = useCallback(
    (packId: PackId): boolean => {
      return state.hasAllAccess || state.unlockedPacks.includes(packId);
    },
    [state.hasAllAccess, state.unlockedPacks]
  );

  const unlockPack = useCallback(
    async (packId: PackId) => {
      const current = stateRef.current;
      const unlockedPacks = current.unlockedPacks.includes(packId)
        ? current.unlockedPacks
        : [...current.unlockedPacks, packId];
      const next = { ...current, unlockedPacks };
      stateRef.current = next;
      setState(next);
      await savePurchases(unlockedPacks, next.hasAllAccess);
    },
    [savePurchases]
  );

  const purchasePack = useCallback(
    async (packId: PackId): Promise<PurchaseResult> => {
      const pack = PREMIUM_PACKS.find((p) => p.id === packId);
      if (!pack) return 'failed';

      if (storeMode === 'simulated') {
        await unlockPack(packId);
        return 'success';
      }
      if (storeMode !== 'live' || !rcInitialized || !Purchases) return 'unavailable';

      try {
        const offerings = await Purchases.getOfferings();
        const product = offerings.current?.availablePackages.find(
          (p: any) => p.product.identifier === pack.productId
        );
        if (!product) {
          console.warn('Purchase failed: product not found in offerings:', pack.productId);
          return 'failed';
        }
        const { customerInfo } = await Purchases.purchasePackage(product);
        if (customerInfo.entitlements.active[packId]) {
          await unlockPack(packId);
          return 'success';
        }
        console.warn('Purchase completed but entitlement is not active:', packId);
        return 'failed';
      } catch (e: any) {
        if (e?.userCancelled) return 'cancelled';
        console.warn('Purchase failed:', e);
        return 'failed';
      }
    },
    [unlockPack]
  );

  const unlockAllAccess = useCallback(async () => {
    const allPacks = PREMIUM_PACKS.map((p) => p.id);
    setState({ unlockedPacks: allPacks, hasAllAccess: true, isLoading: false });
    await savePurchases(allPacks, true);
  }, [savePurchases]);

  const purchaseAllAccess = useCallback(async (): Promise<PurchaseResult> => {
    if (storeMode === 'simulated') {
      await unlockAllAccess();
      return 'success';
    }
    if (storeMode !== 'live' || !rcInitialized || !Purchases) return 'unavailable';

    try {
      const offerings = await Purchases.getOfferings();
      const product = offerings.current?.availablePackages.find(
        (p: any) => p.product.identifier === ALL_ACCESS_PRODUCT_ID
      );
      if (!product) {
        console.warn('Purchase failed: product not found in offerings:', ALL_ACCESS_PRODUCT_ID);
        return 'failed';
      }
      const { customerInfo } = await Purchases.purchasePackage(product);
      if (customerInfo.entitlements.active['all_access']) {
        await unlockAllAccess();
        return 'success';
      }
      console.warn('Purchase completed but entitlement is not active: all_access');
      return 'failed';
    } catch (e: any) {
      if (e?.userCancelled) return 'cancelled';
      console.warn('Purchase failed:', e);
      return 'failed';
    }
  }, [unlockAllAccess]);

  const restorePurchases = useCallback(async (): Promise<PurchaseResult> => {
    if (storeMode === 'simulated') return 'success';
    if (storeMode !== 'live' || !rcInitialized || !Purchases) return 'unavailable';

    try {
      const info = await Purchases.restorePurchases();
      const packs: PackId[] = [];
      let allAccess = false;

      PREMIUM_PACKS.forEach((pack) => {
        if (info.entitlements.active[pack.id]) {
          packs.push(pack.id);
        }
      });

      if (info.entitlements.active['all_access']) {
        allAccess = true;
      }

      setState({ unlockedPacks: packs, hasAllAccess: allAccess, isLoading: false });
      await savePurchases(packs, allAccess);
      return 'success';
    } catch (e) {
      console.warn('Restore failed:', e);
      return 'failed';
    }
  }, [savePurchases]);

  return (
    <StoreContext.Provider
      value={{ ...state, isPurchased, purchasePack, purchaseAllAccess, restorePurchases }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
