import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

//=================== NAVIGATION STACK =============================
import OnBoardingStack from './NavigationStack/OnBoardingStack';

import {SCREEN_KEYS} from '@Constant';
import {navigationRef} from './RootNavigation';
import HomeScreen from '@Screens/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigation({ AppStatus }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name={SCREEN_KEYS.ONBOARDINGSTACK}
          component={OnBoardingStack}
        />
        <Stack.Screen name={SCREEN_KEYS.HOMESCREEN} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
