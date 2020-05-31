import React from 'react';
import { DefaultTheme, Provider as PaperProvider, Colors } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HomeScreen from './components/HomeScreen'
import UserInfoScreen from './components/UserInfoScreen'
import AddPlantScreen from './components/AddPlantScreen'
import PlantDetailsScreen from './components/PlantDetailsScreen'
import TabNavigation from './components/TabNavigation'
import PlantBrowser from './components/PlantBrowser'
import QR from './components/qr'
import InsertPlant from './components/InsertPlant'

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#79C52A',
    accent: '#7EBF88',
    surface: '#FFF0E9',
    placeholder: '#79C52A',
    text: Colors.grey800
  },
};

export default function App() {

  return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerLeft: null,
              headerShown: false
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginForm}
            />
            <Stack.Screen
              name="Register"
              component={RegisterForm}
            />
            <Stack.Screen
              name="Details"
              component={PlantDetailsScreen}
            />
            <Stack.Screen
              name="Tab"
              component={TabNavigation}
            />
            <Stack.Screen
              name="PlantBrowser"
              component={PlantBrowser}
            />
            <Stack.Screen
              name="QR"
              component={QR}
            />
            <Stack.Screen
              name="Insert"
              component={InsertPlant}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};
