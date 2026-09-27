import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PackId, PREMIUM_PACKS, ALL_ACCESS_PRODUCT_ID } from './packs';

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
  purchasePack: (packId: PackId) => Promise<boolean>;
  purchaseAllAccess: () => Promise<boolean>;
  restorePurchases: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

let Purchases: any = null;
let rcInitialized = false;

const initRevenueCat = async () => {
  if (rcInitialized) return;
  try {
    const rc = require('react-native-purchases');
    Purchases = rc.default || rc;
    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey.startsWith('YOUR_')) {
      await Purchases.configure({ apiKey });
      rcInitialized = true;
    }
  } catch {
    // RevenueCat not available (dev mode) — purchases will use local storage
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

  const purchasePack = useCallback(
    async (packId: PackId): Promise<boolean> => {
      const pack = PREMIUM_PACKS.find((p) => p.id === packId);
      if (!pack) return false;

      if (rcInitialized && Purchases) {
        try {
          const offerings = await Purchases.getOfferings();
          const product = offerings.current?.availablePackages.find(
            (p: any) => p.product.identifier === pack.productId
          );
          if (product) {
            const { customerInfo } = await Purchases.purchasePackage(product);
            if (customerInfo.entitlements.active[packId]) {
              const newPacks = [...state.unlockedPacks, packId];
              setState((prev) => ({ ...prev, unlockedPacks: newPacks }));
              await savePurchases(newPacks, state.hasAllAccess);
              return true;
            }
          }
        } catch (e: any) {
          if (!e.userCancelled) {
            console.warn('Purchase failed:', e);
          }
          return false;
        }
      } else {
        // Dev mode: simulate purchase
        const newPacks = [...state.unlockedPacks, packId];
        setState((prev) => ({ ...prev, unlockedPacks: newPacks }));
        await savePurchases(newPacks, state.hasAllAccess);
        return true;
      }

      return false;
    },
    [state.unlockedPacks, state.hasAllAccess, savePurchases]
  );

  const purchaseAllAccess = useCallback(async (): Promise<boolean> => {
    if (rcInitialized && Purchases) {
      try {
        const offerings = await Purchases.getOfferings();
        const product = offerings.current?.availablePackages.find(
          (p: any) => p.product.identifier === ALL_ACCESS_PRODUCT_ID
        );
        if (product) {
          const { customerInfo } = await Purchases.purchasePackage(product);
          if (customerInfo.entitlements.active['all_access']) {
            const allPacks = PREMIUM_PACKS.map((p) => p.id);
            setState({ unlockedPacks: allPacks, hasAllAccess: true, isLoading: false });
            await savePurchases(allPacks, true);
            return true;
          }
        }
      } catch (e: any) {
        if (!e.userCancelled) {
          console.warn('Purchase failed:', e);
        }
        return false;
      }
    } else {
      // Dev mode: simulate
      const allPacks = PREMIUM_PACKS.map((p) => p.id);
      setState({ unlockedPacks: allPacks, hasAllAccess: true, isLoading: false });
      await savePurchases(allPacks, true);
      return true;
    }

    return false;
  }, [savePurchases]);

  const restorePurchases = useCallback(async () => {
    if (rcInitialized && Purchases) {
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
      } catch {}
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
