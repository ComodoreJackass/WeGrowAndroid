import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, Image } from 'react-native';

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
    const [email, setEmail] = useState(route.params.email);
    const [date, setDate] = useState(route.params.date);
    const [numDone, setNumDone] = useState(0);

    const [size1, setSize1] = useState(24);
    const [size2, setSize2] = useState(32);
    const [size3, setSize3] = useState(24);

    useEffect(() => {
        navigation.navigate('Home', {
            jsonToken: jsonToken,
            userId: userId
        })
    }, [jsonToken, userId]);

    useEffect(()=> {
        console.log("Tab section " + numDone);
    }, [numDone])

    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarPosition="bottom"
            tabBarOptions={{
                showIcon: true,
                showLabel: false,
                activeTintColor: 'black',
                inactiveTintColor: Colors.gray100,
                style: { backgroundColor: '#EFF0EF', height:50 },
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
                    username: username
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../assets/addPlants.png')} tintColor={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{
                    jsonToken: jsonToken,
                    userId: userId,
                    testParam: false,
                    numDone: numDone
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../assets/myPlants.png')} tintColor={color} />
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
                    password: password,
                    email: email,
                    date: date,
                    numDone: numDone,
                }}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../assets/account.png')} tintColor={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}