import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import { Avatar, Button, Subheading, Title, Appbar, Card, Paragraph, Text, Divider } from 'react-native-paper';
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
                json.forEach(element => {
                    if (element.done) count++;
                });

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
                //Look into this
                console.log(response.json);
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
            <ScrollView>
                <ImageBackground source={require('../assets/bckgr.png')} style={{
                    flex: 1,
                    resizeMode: "cover",
                    paddingTop: 10
                }}>
                    <Card style={styles.card}>
                        <Card.Title title={"Upravljanje računom"} />
                        <Card.Cover source={require('../assets/header.png')} style={{ marginLeft: 15, marginRight: 15 }} />
                        <Card.Content style={{ padding: 15, paddingTop: 20 }}>
                            <Subheading>Vještina uzgoja:</Subheading>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop:10 }}>
                                <AnimatedCircularProgress
                                    size={120}
                                    width={15}
                                    fill={(done%5)*20}
                                    tintColor="#1D9044"
                                    onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor="#7EBF88">
                                    {
                                        (fill) => (
                                            <Subheading>
                                                Razina: {Math.floor(done/5)}
                                            </Subheading>
                                        )
                                    }
                                </AnimatedCircularProgress>
                            </View>
                            <Divider style={{ marginBottom: 10, marginTop: 20 }} />
                            <Subheading>Uzgojeno biljaka: {done}</Subheading>
                            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                            <Subheading>Korisničko ime:</Subheading>
                            <Paragraph style={{ paddingLeft: 15 }}>{username}</Paragraph>
                            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                            <Subheading>Email:</Subheading>
                            <Paragraph style={{ paddingLeft: 15 }}>{email}</Paragraph>
                            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                            <Subheading>Datum registracije:</Subheading>
                            <Paragraph style={{ paddingLeft: 15 }}>{moment(date).format('DD.MM.YYYY')}</Paragraph>
                            <Divider style={{ marginTop: 10 }} />
                        </Card.Content>
                        <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button
                                onPress={() => navigation.navigate('Login')}
                            >Odjavi me</Button>
                            <Button
                                onPress={createTwoButtonAlert}
                            >Obriši račun</Button>
                        </Card.Actions>
                    </Card>
                </ImageBackground>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E3C8',
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 30,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});