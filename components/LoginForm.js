import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Image, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Button, Snackbar, TextInput, Title, Avatar, Colors, Divider, Portal } from 'react-native-paper';

export default function LoginForm({ navigation, route }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameValidated, setUsernameValidated] = useState(false);
    const [passwordValidated, setPasswordValidated] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackText, setSnackText] = useState('');
    const [loading, setLoading] = useState(false);

    const verifyInput = () => {
        setLoading(true);
        if (username === '') {
            setUsernameValidated(true);
        } else {
            setUsernameValidated(false);
        }

        if (password === '') {
            setPasswordValidated(true);
        } else {
            setPasswordValidated(false);
        }

        if (username !== '' && password !== '') {
            tryToLogIn();
        } else {
            setLoading(false);
        }
    }

    async function tryToLogIn() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.status == 200) {
                let json = await response.json();
                console.log("logged in");
                setLoading(false);
                navigation.navigate('Tab', {
                    jsonToken: json.accessToken,
                    userId: json.userId,
                    username: username,
                    password: password,
                    email: json.email,
                    date: json.date
                });
            }
            else {
                setUsername('');
                setPassword('');
                setSnackText('Korisničko ime ili lozinka ne postoje');
                setVisible(true);
                setLoading(false);
                console.log(response.status);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    //Display message if account was succesfully created
    React.useEffect(() => {
        if (route.params?.post) {
            setSnackText(route.params.post);
            setVisible(true);
        }
    }, [route.params?.post]);

    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={verifyInput}
                />
            }
            >
                <View style={styles.container}>
                    <View style={{ paddingTop: "10%", paddingBottom: "3%" }}>
                        <Image source={require('../assets/login.png')} style={{ alignSelf: 'center' }} />
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: "5%" }}>
                            <View style={{ flex: 1 }}></View>
                            <Divider style={{ flex: 1, backgroundColor: '#79C52A', padding: "0.2%", marginTop: "8.4%" }} />
                            <Title style={{ flex: 2.5, paddingTop: "2.5%", textAlign: "center" }}>Dobrodošli</Title>
                            <Divider style={{ flex: 1, backgroundColor: '#79C52A', padding: "0.2%", marginTop: "8.4%" }} />
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>
                    <TextInput
                        label='Korisničko ime'
                        mode='outlined'
                        theme={{ roundness: 50 }}
                        style={{ backgroundColor: '#FFF', marginLeft: "15%", marginRight: "15%", marginBottom: '3%' }}
                        error={usernameValidated}
                        onChangeText={text => {
                            setUsername(text.toString());
                            setUsernameValidated(false);
                        }}
                        value={username}
                    />
                    <TextInput
                        label='Lozinka'
                        mode='outlined'
                        theme={{ roundness: 50 }}
                        style={{ backgroundColor: '#FFF', marginLeft: "15%", marginRight: "15%" }}
                        error={passwordValidated}
                        secureTextEntry={true}
                        onChangeText={text => {
                            setPassword(text.toString());
                            setPasswordValidated(false);
                        }}
                        value={password}
                    />
                    <View style={{ paddingTop: "10%" }}>
                        <TouchableOpacity
                            style={{ paddingTop: "3%", paddingBottom: "3%", marginLeft: "30%", marginRight: "30%", backgroundColor: '#79C52A', borderRadius: 20 }}
                            onPress={verifyInput}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }} uppercase={false}>
                                Prijavi me
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: "25%", paddingBottom: '8%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text upercase={false} style={{ color: 'black', paddingRight: "1%" }}>
                            Nemate račun?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            activeOpacity={0.8}
                        ><Text upercase={false} style={{ color: '#799EAE' }} >
                                Registrirajte se
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
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
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: "6%",
        paddingRight: "6%",
        backgroundColor: "#FFFFFF"
    },
});