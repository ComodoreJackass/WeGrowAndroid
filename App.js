import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HomeScreen from './components/HomeScreen'
import UserInfoScreen from './components/UserInfoScreen'
import AddPlantScreen from './components/AddPlantScreen'

const Stack = createStackNavigator();

export default function App() {

  return (
    <>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerLeft: null
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
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="User"
              component={UserInfoScreen}
            />
            <Stack.Screen
              name="Plants"
              component={AddPlantScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};
