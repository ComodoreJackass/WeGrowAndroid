import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, List, Snackbar, Subheading } from 'react-native-paper';

export default function AddPlantScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    const [plants, setPlants] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [growthStages, setGrowthStages] = useState([]);
    const [cards, setCards] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [visible, setVisible] = useState(false);
    const [snackText, setSnackText] = useState('');

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

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
                tryToFetchMaterials();
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function tryToFetchMaterials() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/materials', {
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
                setMaterials(json);
                tryToFetchGrowthStages();
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function tryToFetchGrowthStages() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/growthStages', {
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
                setGrowthStages(json);
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function getGrowthStage(plantId) {
        let tmp = growthStages.filter(stage => stage.plant_id == plantId);
        return tmp[0].id;
    }

    async function tryToAdd(plantId, stageId) {
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
                    stageId: stageId,
                    done: false
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                setSnackText("Biljka dodana")
                setVisible(true);
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

    function populateMaterials(plantId) {
        let tmp = materials.filter(mat => mat.plant_id == plantId).map(mat => (
            <List.Item key={mat.id} title={mat.material} style={{ marginLeft: -64 }} />
        ));
        return tmp;
    }

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
                            style={{ marginLeft: -24 }}
                            title="Materijali"
                            left={props => <List.Icon {...props}
                                icon={require('../assets/bucket2.png')} />}
                        >
                            {populateMaterials(plant.id)}
                        </List.Accordion>
                    </List.Section>
                </Card.Content>
                <Card.Actions>
                    <Button
                        onPress={() => tryToAdd(plant.id, getGrowthStage(plant.id))}
                    >Dodaj</Button>
                </Card.Actions>
            </Card>
        ));

        setCards(tmp);

    }, [growthStages])

    const onRefresh = () => {
        setRefreshing(true);
        tryToLogIn().then(() => {
            setRefreshing(false);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F1E3C8' }}>
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                {
                    cards.length > 0
                        ?
                        cards
                        :
                        <Subheading
                            style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 200 }}
                        >
                            Učitavanje...
                        </Subheading>
                }
            </ScrollView>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Ok',
                    onPress: () => {
                        onToggleSnackBar
                    },
                }}
            >
                {snackText}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 5
    },
    card: {
        borderWidth: 10,
        borderColor: '#FFF0E9',
        marginBottom: 10,
        borderRadius: 6
    },
});