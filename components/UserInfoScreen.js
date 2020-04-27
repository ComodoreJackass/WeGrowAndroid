import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Avatar, Button, Subheading, Title } from 'react-native-paper';

export default function UserInfoScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [username, setUsername] = useState(route.params.username);
    const [password, setPassowrd] = useState(route.params.password);

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
            <View style={{ flexDirection: "row" }}>

                <View style={{ flex: 1 }}></View>

                <View style={{ flex: 3 }}>
                    <View style={{ flexDirection: "column", paddingBottom: 40}}>
                        <Title>Upravljanje računom</Title>
                        <Subheading style={{ paddingTop: 20, paddingBottom:40 }}>Korisničko ime: {username} </Subheading>


                        <View style={{ flexDirection: "row"}}>
                            <Button
                                theme={{ roundness: 5 }}
                                style={{ padding: 10, flex: 1 }}
                                mode="contained"
                                onPress={() => navigation.navigate('Login')}
                            >
                                Odjavi me
                            </Button>
                        </View>

                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <Button
                                theme={{ roundness: 5 }}
                                style={{ padding: 10, flex: 1 }}
                                mode="contained"
                                onPress={createTwoButtonAlert}
                            >
                                Obriši račun
                            </Button>
                        </View>
        
                    </View>
                </View>

                <View style={{ flex: 1 }}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E3C8',
        padding: 10,
        justifyContent: "center"
    }
});