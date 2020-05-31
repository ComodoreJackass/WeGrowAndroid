import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ImageBackground, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, List, Subheading, Modal, Portal, Searchbar, Divider, FAB } from 'react-native-paper';

export default function AddPlantScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);

    const [refreshing, setRefreshing] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const onRefresh = () => {
        setRefreshing(false);
        /*tryToLogIn().then(() => {
            setRefreshing(false);
        });*/
    }

    //Search implementation
    /*useEffect(() => {
        if (searchTerm != '') {
            let tmp = plants.filter(plant => plant.name.toUpperCase().indexOf(searchTerm.toUpperCase()) == 0).map(plant => (
                <Card key={plant.id} style={styles.card}>
                    <ImageBackground source={{ uri: `data:image/jpg;base64,${plant.image}` }} style={{
                        flex: 1,
                        resizeMode: "cover"
                    }}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <Card.Title title={plant.name} subtitle={'Odabir'} subtitleStyle={{ color: "#FFF0E9" }} titleStyle={{ color: "#FFF0E9" }} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                        </View>
                    </ImageBackground>
                    <Card.Content style={{ paddingTop: 10 }}>
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
                            onPress={() => tryToAdd(plant.id)}
                        >Dodaj</Button>
                    </Card.Actions>
                </Card>
            ));

            setCards(tmp);
        } else {
            let tmp = plants.map(plant => (
                <Card key={plant.id} style={styles.card}>
                    <ImageBackground source={{ uri: `data:image/jpg;base64,${plant.image}` }} style={{
                        flex: 1,
                        resizeMode: "cover"
                    }}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <Card.Title title={plant.name} subtitle={'Odabir'} subtitleStyle={{ color: "#FFF0E9" }} titleStyle={{ color: "#FFF0E9" }} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
                        </View>
                    </ImageBackground>
                    <Card.Content style={{ paddingTop: 10 }}>
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
                            onPress={() => tryToAdd(plant.id)}
                        >Dodaj</Button>
                    </Card.Actions>
                </Card>
            ));

            setCards(tmp);
        }
    }, [searchTerm]);*/

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
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
                    <Image source={require('../assets/ap.png')} style={{ alignSelf: 'center', marginTop: 36 }} />
                    <View style={{ margin: 5 }}>
                        <Title style={{ textAlign: 'center', color: '#225921' }}>Kategorije</Title>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}></View>
                        <View style={{ flex: 2.5, flexDirection: 'column' }}>
                            <Card style={{ marginTop: 5, backgroundColor: '#FFE3E3', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('PlantBrowser', {
                                    kategorija: 'Voće',
                                    jsonToken: jsonToken,
                                    userId: userId
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>Voće</Paragraph>
                                    <Image source={require('../assets/voce.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                            <Card style={{ marginTop: 5, backgroundColor: '#F5F0BE', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('PlantBrowser', {
                                    kategorija: 'Cvijeće',
                                    jsonToken: jsonToken,
                                    userId: userId
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>Cvijeće</Paragraph>
                                    <Image source={require('../assets/cvijece.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                            <Card style={{ marginTop: 5, backgroundColor: '#E0F4F6', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('QR', {
                                    jsonToken: jsonToken,
                                    userId: userId
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>QR kod</Paragraph>
                                    <Image source={require('../assets/qr.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}></View>
                        <View style={{ flex: 2.5, flexDirection: 'column' }}>
                            <Card style={{ marginTop: 5, backgroundColor: '#CAF5B0', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('PlantBrowser', {
                                    kategorija: 'Povrće',
                                    jsonToken: jsonToken,
                                    userId: userId
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>Povrće</Paragraph>
                                    <Image source={require('../assets/povrce.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                            <Card style={{ marginTop: 5, backgroundColor: '#E8E4FF', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('PlantBrowser', {
                                    kategorija: 'Začini',
                                    jsonToken: jsonToken,
                                    userId: userId
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>Začini</Paragraph>
                                    <Image source={require('../assets/zacini.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                            <Card style={{ marginTop: 5, backgroundColor: '#FFF2DE', height: 90, borderRadius: 12 }} onPress={() => {
                                navigation.navigate('Insert', {
                                    jsonToken: jsonToken,
                                    userId: userId,
                                    username: route.params.username
                                })
                            }}>
                                <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Paragraph style={{ padding: 2 }}>Dodaj biljku</Paragraph>
                                    <Image source={require('../assets/dodajBiljku.png')} style={{ alignSelf: 'center' }} />
                                </Card.Content>
                            </Card>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}></View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View >
    );

    /*return (
        <View style={{ flex: 1, backgroundColor: '#FAF7F7' }}>
            <ImageBackground source={require('../assets/background.png')} style={{
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
                <FAB
                    style={{
                        position: 'absolute',
                        left: 2,
                        bottom: 10,
                    }}
                    small
                    icon="magnify"
                    onPress={() => setSearchVisible(true)}
                />
            </ImageBackground>
        </View>
    );*/
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderWidth: 1,
        borderColor: "#FFF",
        backgroundColor: "#FFF",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 6,
        marginLeft: 45,
        marginRight: 30,
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