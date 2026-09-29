import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationAction, usePreventRemove } from '@react-navigation/native';

interface ConfirmTexts {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  // Runs when the player confirms leaving (not for `leave`)
  onConfirm?: () => void;
}

/**
 * Asks for confirmation before the iOS back swipe, Android back button or any
 * other navigation removes the screen. Returns `leave`, which performs a
 * navigation action without asking (e.g. moving on to the next screen).
 */
export const useConfirmLeave = (navigation: any, texts: ConfirmTexts) => {
  // Set once leaving is allowed. Prevention turns off on the next render,
  // then the effect below performs the navigation.
  const [leaveAction, setLeaveAction] = useState<NavigationAction | null>(null);

  useEffect(() => {
    if (leaveAction) navigation.dispatch(leaveAction);
  }, [leaveAction, navigation]);

  usePreventRemove(leaveAction === null, ({ data }) => {
    Alert.alert(texts.title, texts.message, [
      { text: texts.cancel, style: 'cancel' },
      {
        text: texts.confirm,
        style: 'destructive',
        onPress: () => {
          texts.onConfirm?.();
          setLeaveAction(data.action);
        },
      },
    ]);
  });

  return setLeaveAction;
};
