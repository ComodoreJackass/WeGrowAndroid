import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Icon } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, List } from 'react-native-paper';

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

    async function tryToAdd(plantId) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/insert', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    userId: userId,
                    plantId: plantId,
                    //TODO dehardkodiraj
                    stageId: 2,
                    done: false
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                console.log("Added");
            }
            else {
                console.log(responseStatus);
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
            <Card key={plant.id} style={styles.card}>
                <Card.Title title={plant.name} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                <Card.Content>
                    <Title>Opis</Title>
                    <Paragraph>{plant.summary}</Paragraph>
                    <Title>Težina uzgoja</Title>
                    <Paragraph>{plant.difficulty}</Paragraph>
                    <List.Section>
                        <List.Accordion
                        style={{marginLeft: -24}}
                            title="Potrebni materijali"
                            left={props => <List.Icon {...props}
                                icon={require('../assets/bucket2.png')} />}
                        >
                            <List.Item title="First item" />
                            <List.Item title="Second item" />
                        </List.Accordion>
                    </List.Section>
                </Card.Content>
                <Card.Actions>
                    <Button
                        onPress={() => tryToAdd(plant.id)}
                    >Dodaj</Button>
                </Card.Actions>
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
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                {cards}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E3C8',
        padding: 10
    },
    card: {
        borderWidth: 10,
        borderColor: '#FFF0E9',
        marginBottom: 10,
        borderRadius: 6
    },
});