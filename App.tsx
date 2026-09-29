import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Alegreya_700Bold, Alegreya_900Black } from '@expo-google-fonts/alegreya';
import { Nunito_400Regular, Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { GameProvider } from './src/hooks/GameContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { RulesScreen } from './src/screens/RulesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TeamSetupScreen } from './src/screens/TeamSetupScreen';
import { GameScreen } from './src/screens/GameScreen';
import { RoundResultScreen } from './src/screens/RoundResultScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { I18nProvider } from './src/i18n/I18nContext';
import { StoreProvider } from './src/store/StoreContext';
import { ShopScreen } from './src/screens/ShopScreen';
import { QuestSettingsScreen } from './src/screens/QuestSettingsScreen';
import { QuestPlayerSetup } from './src/screens/QuestPlayerSetup';
import { QuestGameScreen } from './src/screens/QuestGameScreen';
import { QuestScoresScreen } from './src/screens/QuestScoresScreen';
import { AchievementProvider } from './src/achievements/AchievementContext';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { AchievementToast } from './src/components/AchievementToast';
import { ProgressionProvider } from './src/progression/ProgressionContext';
import { LevelUpToast } from './src/components/LevelUpToast';
import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Alegreya_700Bold,
    Alegreya_900Black,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <I18nProvider>
    <StoreProvider>
    <AchievementProvider>
    <ProgressionProvider>
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Rules" component={RulesScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="RoundResult" component={RoundResultScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="QuestSettings" component={QuestSettingsScreen} />
          <Stack.Screen name="QuestPlayerSetup" component={QuestPlayerSetup} />
          <Stack.Screen name="QuestGame" component={QuestGameScreen} />
          <Stack.Screen name="QuestScores" component={QuestScoresScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
    <LevelUpToast />
    </ProgressionProvider>
    <AchievementToast />
    </AchievementProvider>
    </StoreProvider>
    </I18nProvider>
  );
}
