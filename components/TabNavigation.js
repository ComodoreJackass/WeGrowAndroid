import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from './HomeScreen';
import UserInfoScreen from './UserInfoScreen'
import AddPlantScreen from './AddPlantScreen'
import { Colors } from 'react-native/Libraries/NewAppScreen';

function PlaceHolder() {
    return (<View></View>);
}

const Tab = createMaterialTopTabNavigator();

export default function TabNavigation({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [username, setUsername] = useState(route.params.username);
    const [password, setPassowrd] = useState(route.params.password);

    const [size1, setSize1] = useState(24);
    const [size2, setSize2] = useState(32);
    const [size3, setSize3] = useState(24);

    useEffect(() => {
        navigation.navigate('Home', {
            jsonToken: jsonToken,
            userId: userId
        })
    }, [jsonToken, userId]);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarPosition="bottom"
            tabBarOptions={{
                showIcon: true,
                showLabel: false,
                activeTintColor: '#FFF0E9',
                inactiveTintColor: Colors.gray100,
                style: { backgroundColor: '#1D9044', height:55 },
                indicatorStyle: {
                    opacity: 0
                  }
            }}
            initialLayout={ {width: Dimensions.get('window').width} }
        >
            <Tab.Screen
                name="Plants"
                component={AddPlantScreen}
                initialParams={{
                    jsonToken: jsonToken,
                    userId: userId,
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="flower-outline" color={color} size={28} />
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{
                    jsonToken: jsonToken,
                    userId: userId,
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="clipboard-text-outline" color={color} size={28} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={UserInfoScreen}
                initialParams={{
                    jsonToken: jsonToken,
                    userId: userId,
                    username: username,
                    password: password
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={28} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}