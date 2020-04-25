import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';

export default function UserInfoScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    return (
        <View style={styles.container}>
            <Title style={styles.content}>
                Upravljanje računom
            </Title>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E3C8',
        padding: 10
    },
    content: {
        flex: 9
    }
});