import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';

export default function AddPlantScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    const [plants, setPlants] = useState([]);
    const [cards, setCards] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    async function tryToLogIn() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/plants', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                }
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                let json = await response.json();
                setPlants(json);
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        tryToLogIn();
    }, [jsonToken, userId]);

    useEffect(() => {
        let tmp = plants.map(plant => (
            <Card key={plant.id} style={styles.card} >
                <Card.Title title={plant.name} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                <Card.Content>
                    <Title>Description</Title>
                    <Paragraph>{plant.summary}</Paragraph>
                    <Title>Difficulty</Title>
                    <Paragraph>{plant.difficulty}</Paragraph>
                </Card.Content>
            </Card>
        ));

        setCards(tmp);

    }, [plants])

    const onRefresh = () => {
        setRefreshing(true);
        tryToLogIn().then(() => {
            setRefreshing(false);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                {cards}
            </ScrollView>
            <Appbar>
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
    card: {
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6
    },
});