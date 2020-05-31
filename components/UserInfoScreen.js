import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ImageBackground, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { Avatar, Button, Subheading, Title, Appbar, Card, Paragraph, Divider, List, TextInput } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from 'moment';

export default function UserInfoScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [username, setUsername] = useState(route.params.username);
    const [password, setPassowrd] = useState(route.params.password);
    const [email, setEmail] = useState(route.params.email);
    const [date, setDate] = useState(route.params.date);
    const [done, setDone] = useState(0);
    const [lCards, setLeftCards] = useState([]);
    const [rCards, setRightCards] = useState([]);

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', (e) => {
            tryToLogIn();
        });

        return unsubscribe;
    }, []);

    async function tryToLogIn() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/byId', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    userId: userId
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                let json = await response.json();

                let count = 0;
                let doneItems = [];
                json.forEach(element => {
                    if (element.done) {
                        count++;
                        doneItems.push(
                            <Card key={uuidv4()} style={styles.card2}>
                                <ImageBackground source={{ uri: `data:image/jpg;base64,${element.plant.image}` }} style={{
                                    flex: 1,
                                    resizeMode: "cover",
                                    height: 100,
                                }}>
                                    <View style={{ height: "100%", backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <Card.Content>
                                            <View style={{height:"100%", width:'100%', justifyContent:'center', alignItems:'center'}}>
                                                <Text
                                                    style={{ fontSize: 16, color: 'white', textAlign: 'center' }}
                                                >
                                                    {element.plant.name}
                                                </Text>
                                            </View>
                                        </Card.Content>
                                    </View>
                                </ImageBackground>
                            </Card >
                        );
                    }
                });

                let lcards = [];
                let rcards = [];

                for (var i = 0; i < doneItems.length; i++) {
                    if (i % 2 === 0) {
                        lcards.push(doneItems[i]);
                    } else {
                        rcards.push(doneItems[i]);
                    }
                }

                setLeftCards(lcards);
                setRightCards(rcards);

                setDone(count);
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function tryToDeleteAccount() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/deleteAccount', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                navigation.navigate('Login');
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createTwoButtonAlert = () =>
        Alert.alert(
            "Obriši račun",
            "Želite li obrisati račun",
            [
                {
                    text: "Odustani",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Obriši račun",
                    onPress: () => tryToDeleteAccount(),
                }
            ],
            { cancelable: false }
        );


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/background.png')} style={{
                flex: 1,
                resizeMode: "cover",
                paddingTop: 10
            }}>
                <ScrollView>
                    <Card style={styles.card}>
                        <Card.Cover source={require('../assets/accImage.png')} />
                        <Card.Content style={{ padding: 15, paddingTop: 10 }}>
                            <Title style={{ textAlign: 'center', paddingBottom: 10 }}>Bok, {username}</Title>


                            <List.Section style={{ marginLeft: -20 }}>
                                <List.Accordion
                                    title="Postignuća"
                                    left={props => <List.Icon icon={require('../assets/b1.png')} />}
                                >
                                    <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', marginLeft: '-10%' }}>
                                        <AnimatedCircularProgress
                                            size={120}
                                            width={15}
                                            fill={(done % 5) * 20}
                                            tintColor="#1D9044"
                                            onAnimationComplete={() => console.log('onAnimationComplete')}
                                            backgroundColor="#7EBF88">
                                            {
                                                (fill) => (
                                                    <Subheading>
                                                        Razina: {Math.floor(done / 5)}
                                                    </Subheading>
                                                )
                                            }
                                        </AnimatedCircularProgress>
                                    </View>
                                    <Subheading style={{ textAlign: 'center', marginLeft: '-10%' }}>Uzgojeno biljaka: {done}</Subheading>
                                </List.Accordion>
                                <List.Accordion
                                    title="Uzgojene biljke"
                                    left={props => <List.Icon icon={require('../assets/b2.png')} />}
                                >
                                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: '-10%' }}>
                                        <View style={{ flex: 30, flexDirection: 'column' }}>
                                            {lCards}
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}></View>
                                        <View style={{ flex: 30, flexDirection: 'column' }}>
                                            {rCards}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion
                                    title="Postavke računa"
                                    left={props => <List.Icon icon={require('../assets/b3.png')} />}
                                >
                                    <Subheading style={{ paddingLeft: "10%" }}>Korisničko ime:</Subheading>
                                    <Paragraph style={{ paddingLeft: "15%" }}>{username}</Paragraph>
                                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                    <Subheading style={{ paddingLeft: "10%" }}>Email:</Subheading>
                                    <Paragraph style={{ paddingLeft: "15%" }}>{email}</Paragraph>
                                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                    <Subheading style={{ paddingLeft: "10%" }}>Datum registracije:</Subheading>
                                    <Paragraph style={{ paddingLeft: "15%" }}>{moment(date).format('DD.MM.YYYY')}</Paragraph>
                                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: -30, padding: 0 }}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Login')}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                                Odjavi me
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={createTwoButtonAlert}
                                            activeOpacity={0.8}
                                            style={{ marginLeft: "20%" }}
                                        >
                                            <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                                Obriši račun
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                </List.Accordion>
                            </List.Section>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </ImageBackground>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 30,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    card2: {
        marginTop: "3%",
        borderRadius: 0,
    }
});