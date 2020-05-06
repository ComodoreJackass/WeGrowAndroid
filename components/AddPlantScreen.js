import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, List, Subheading, Modal, Portal, Searchbar, Divider } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";

export default function AddPlantScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    const [plants, setPlants] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [growthStages, setGrowthStages] = useState([]);
    const [cards, setCards] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
                navigation.navigate('Home', { testParam: true, })
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
                    <Subheading>Opis:</Subheading>
                    <Paragraph>{plant.summary}</Paragraph>
                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                    <Subheading>Težina uzgoja:</Subheading>
                    <Paragraph>{plant.difficulty}</Paragraph>
                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
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

    //Search implementation
    useEffect(() => {
        if (searchTerm != '') {
            let tmp = plants.filter(plant => plant.name.toUpperCase().indexOf(searchTerm.toUpperCase()) == 0).map(plant => (
                <Card key={plant.id} style={styles.card}>
                    <Card.Title title={plant.name} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                    <Card.Content>
                        <Subheading>Opis:</Subheading>
                        <Paragraph>{plant.summary}</Paragraph>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                        <Subheading>Težina uzgoja:</Subheading>
                        <Paragraph>{plant.difficulty}</Paragraph>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
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
        } else {
            let tmp = plants.map(plant => (
                <Card key={plant.id} style={styles.card}>
                    <Card.Title title={plant.name} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                    <Card.Content>
                        <Subheading>Opis:</Subheading>
                        <Paragraph>{plant.summary}</Paragraph>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                        <Subheading>Težina uzgoja:</Subheading>
                        <Paragraph>{plant.difficulty}</Paragraph>
                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
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
        }
    }, [searchTerm]);

    const actions = [
        {
            text: "Search",
            icon: require('../assets/search.png'),
            name: "bt_search",
            buttonSize: 34,
            margin: 0,
            color: '#1D9044',
            position: 1,
        },
        {
            text: "Add plant",
            icon: require('../assets/camera.png'),
            name: "bt_add_plant",
            buttonSize: 34,
            margin: 0,
            color: '#1D9044',
            position: 3
        }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#F1E3C8' }}>
            <ImageBackground source={require('../assets/bckgl.png')} style={{
                flex: 1,
                resizeMode: "cover",
                justifyContent: "center"
            }}>
                <ScrollView
                    style={styles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
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
                <Portal>
                    <Modal visible={searchVisible} onDismiss={() => setSearchVisible(false)}>
                        <Searchbar
                            style={{ marginLeft: 40, marginRight: 40, marginBottom: 100 }}
                            placeholder="Pretraživanje"
                            onChangeText={(text) => { setSearchTerm(text) }}
                            onIconPress={() => setSearchVisible(false)}
                            value={searchTerm}
                        />
                    </Modal>
                </Portal>
                <FloatingAction
                    position="left"
                    actions={actions}
                    distanceToEdge={5}
                    buttonSize={34}
                    color='#1D9044'
                    onPressItem={name => {
                        if (name === 'bt_search') {
                            setSearchVisible(true);
                        }
                    }}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 6,
        marginLeft: 20,
        marginRight: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        left: -14,
        bottom: 100,
    },
    fab1: {
        position: 'absolute',
        margin: 16,
        left: -14,
        bottom: 50,
    },
    fab2: {
        position: 'absolute',
        margin: 16,
        left: -14,
        bottom: 0,
    },
});