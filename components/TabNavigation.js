import React, { useState, useEffect } from 'react';
import { Text, View, BackHandler, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Appbar } from 'react-native-paper';

import HomeScreen from './HomeScreen';
import UserInfoScreen from './UserInfoScreen'
import AddPlantScreen from './AddPlantScreen'

function PlaceHolder() {
    return (<View></View>);
}

const Tab = createBottomTabNavigator();

export default function TabNavigation({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [size1, setSize1] = useState(24);
    const [size2, setSize2] = useState(32);
    const [size3, setSize3] = useState(24);

    useEffect(() => {
        navigation.navigate('Home', {
            jsonToken: jsonToken,
            userId: userId
        })
    }, [jsonToken, userId]);

    function PlaceHolder() {
        return (<View></View>);
    }

    function PaperTabBar({ state, descriptors, navigation }) {
        return (
            <Appbar style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <Appbar.Action
                    icon="flower-outline"
                    size={size1}
                    onPress={() => {
                        setSize1(32);
                        setSize2(24);
                        setSize3(24);
                        navigation.navigate('Plants', {
                            jsonToken: jsonToken,
                            userId: userId
                        })
                    }}
                />
                <Appbar.Action
                    icon="clipboard-text-outline"
                    size={size2}
                    onPress={() => {
                        setSize1(24);
                        setSize2(32);
                        setSize3(24);
                        navigation.navigate('Home', {
                            jsonToken: jsonToken,
                            userId: userId
                        })
                    }}
                />
                <Appbar.Action
                    icon="account"
                    size={size3}
                    onPress={() => {
                        setSize1(24);
                        setSize2(24);
                        setSize3(32);
                        navigation.navigate('User', {
                            jsonToken: jsonToken,
                            userId: userId
                        }
                        )
                    }}
                />
            </Appbar>
        );
    }

    return (
        <Tab.Navigator tabBar={props => <PaperTabBar {...props} />}>
            <Tab.Screen name="Placeholder" component={PlaceHolder} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Plants" component={AddPlantScreen} />
            <Tab.Screen name="User" component={UserInfoScreen} />
        </Tab.Navigator>
    );
}