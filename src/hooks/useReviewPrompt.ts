import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_KEY = '@alias_quest_review';
const GAMES_BEFORE_PROMPT = 3;

interface ReviewState {
  gamesPlayed: number;
  hasRated: boolean;
  lastPromptedAt: number;
}

export const useReviewPrompt = () => {
  const [state, setState] = useState<ReviewState>({
    gamesPlayed: 0,
    hasRated: false,
    lastPromptedAt: 0,
  });

  useEffect(() => {
    AsyncStorage.getItem(REVIEW_KEY).then((saved) => {
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch {}
      }
    });
  }, []);

  const save = useCallback(async (newState: ReviewState) => {
    setState(newState);
    await AsyncStorage.setItem(REVIEW_KEY, JSON.stringify(newState)).catch(() => {});
  }, []);

  const recordGamePlayed = useCallback(async () => {
    const newState = { ...state, gamesPlayed: state.gamesPlayed + 1 };
    await save(newState);
  }, [state, save]);

  const shouldPrompt = useCallback((): boolean => {
    if (state.hasRated) return false;
    if (state.gamesPlayed < GAMES_BEFORE_PROMPT) return false;
    const daysSinceLastPrompt = (Date.now() - state.lastPromptedAt) / (1000 * 60 * 60 * 24);
    if (state.lastPromptedAt > 0 && daysSinceLastPrompt < 7) return false;
    return true;
  }, [state]);

  const showPrompt = useCallback(
    (strings: { title: string; message: string; later: string; now: string }) => {
      if (!shouldPrompt()) return;

      save({ ...state, lastPromptedAt: Date.now() });

      Alert.alert(strings.title, strings.message, [
        {
          text: strings.later,
          style: 'cancel',
        },
        {
          text: strings.now,
          onPress: async () => {
            await save({ ...state, hasRated: true, lastPromptedAt: Date.now() });
            try {
              const StoreReview = require('expo-store-review');
              if (await StoreReview.isAvailableAsync()) {
                await StoreReview.requestReview();
              }
            } catch {}
          },
        },
      ]);
    },
    [state, shouldPrompt, save]
  );

  return { recordGamePlayed, showPrompt, shouldPrompt };
};
