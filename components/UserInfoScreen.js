import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';

export default function UserInfoScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    return (
        <View style={styles.container}>
            <Text style={styles.content}>
                Hello
            </Text>
            <Appbar style={styles.nav}>
                <Appbar.Action
                    icon="flower-outline"
                    onPress={() => navigation.navigate('Plants', {
                        jsonToken: jsonToken,
                        userId: userId
                    })}
                />
                <Appbar.Action
                    icon="clipboard-text-outline"
                    onPress={() => navigation.navigate('Home', {
                        jsonToken: jsonToken,
                        userId: userId
                    })}
                />
                <Appbar.Action
                    icon="account"
                    onPress={() => navigation.navigate('User', {
                        jsonToken: jsonToken,
                        userId: userId
                    })}
                />
            </Appbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nav: {
        flex:1
    },
    content:{
        flex:9
    }
});