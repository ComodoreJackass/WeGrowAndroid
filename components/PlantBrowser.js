import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Colors, ProgressBar, Subheading, IconButton, Appbar, TextInput, Divider, List } from 'react-native-paper';

export default function PlantBrowser({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [plants, setPlants] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [lCards, setLeftCards] = useState([]);
    const [rCards, setRightCards] = useState([]);
    const [refreshing, setRefreshing] = useState(true);

    const onRefresh = () => {
        setRefreshing(true);
        tryToLogIn().then(() => {
            setRefreshing(false);
        });
    }

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Plants')
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

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
                setRefreshing(false);
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
            setRefreshing(false);
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

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function populateMaterials(plantId) {
        let split = plantId.split(";");
        console.log(split);
        let tmp = split.map(mat => (
            <Text key={uuidv4()} style={{ marginBottom: 5 }}>
                {mat}
            </Text>
        ));
        return tmp;
    }

    useEffect(() => {
        let tmp = plants.filter(plant => {
            return (route.params.kategorija == plant.category ? true : false);
        }
        ).map(plant => (
            <Card key={plant.id} style={{
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginBottom: 10,
                marginTop: 10,
                borderRadius: 6
            }}>
                <Image source={{ uri: `data:image/jpg;base64,${plant.image}` }} style={{
                    flex: 1,
                    resizeMode: "cover",
                    height: 100,
                    borderRadius: 10,
                    marginTop: -5,
                    marginLeft: -2,
                    marginRight: -2
                }}></Image>
                <Card.Content style={{ paddingTop: 10 }}>
                    <Subheading style={{ textAlign: 'center', marginBottom: 5 }}>{plant.name}</Subheading>
                    <List.Section>
                        <Paragraph>By {plant.owner}</Paragraph>
                        <List.Accordion
                            style={{ marginLeft: -14 }}
                            title="Info"
                        >
                            <Subheading>Opis:</Subheading>
                            <Paragraph>{plant.summary}</Paragraph>
                            <Divider style={{ marginBottom: 10, marginTop: -5 }} />
                            <Subheading>Težina uzgoja:</Subheading>
                            <Paragraph>{plant.difficulty}</Paragraph>
                            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                            <Subheading>Materijali:</Subheading>
                            {populateMaterials(plant.materials)}
                        </List.Accordion>
                    </List.Section>
                </Card.Content>
                <Card.Actions>
                    <TouchableOpacity
                        onPress={() => tryToAdd(plant.id)}
                        activeOpacity={0.8}
                        style={{ marginLeft: 10 }}
                    >
                        <Text style={{ color: '#799EAE', fontSize: 16 }}>
                            Dodaj
                        </Text>
                    </TouchableOpacity>
                </Card.Actions>
            </Card>
        ));


        let lcards = [];
        let rcards = [];

        for (var i = 0; i < tmp.length; i++) {
            if (i % 2 === 0) {
                lcards.push(tmp[i]);
            } else {
                rcards.push(tmp[i]);
            }
        }

        setLeftCards(lcards);
        setRightCards(rcards);

    }, [materials])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Appbar.Header theme={{ colors: { primary: "#EFF0EF" } }}>
                <Appbar.BackAction
                    onPress={() => navigation.navigate('Plants')}
                    color='purple'
                />
                <Appbar.Content
                    title="Pregled biljaka"
                    titleStyle={{ color: 'purple' }}
                />
            </Appbar.Header>
            <ImageBackground source={require('../assets/background.png')} style={{
                flex: 1,
                resizeMode: "cover",
                paddingTop: 10
            }}>
                <ScrollView
                    style={styles.container} refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Image source={require('../assets/chef.png')} style={{ alignSelf: 'center' }} />
                    <View style={{ margin: 5 }}>
                        <Title style={{ textAlign: 'center', color: 'purple' }}>{route.params.kategorija}</Title>
                    </View>
                    {
                        lCards.length > 0
                            ?
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'column' }}></View>
                                <View style={{ flex: 30, flexDirection: 'column' }}>
                                    {lCards}
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}></View>
                                <View style={{ flex: 30, flexDirection: 'column' }}>
                                    {rCards}
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}></View>
                            </View>
                            :
                            <Subheading
                                style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 50 }}
                            >
                                Loading...
                            </Subheading>
                    }
                </ScrollView>
            </ImageBackground>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
});