import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider } from './src/hooks/GameContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { RulesScreen } from './src/screens/RulesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TeamSetupScreen } from './src/screens/TeamSetupScreen';
import { GameScreen } from './src/screens/GameScreen';
import { RoundResultScreen } from './src/screens/RoundResultScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { StatsScreen } from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0F0C29' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Rules" component={RulesScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="RoundResult" component={RoundResultScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
