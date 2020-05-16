import React, { useState } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView, ImageBackground, Text, ActivityIndicator } from 'react-native';
import { Button, Portal } from 'react-native-paper';
import { TextInput, Snackbar, Title, Avatar, Colors, Divider } from 'react-native-paper';

export default function RegisterForm({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailValidated, setEmailValidated] = useState(false);
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

        if (email === '') {
            setEmailValidated(true);
        } else {
            setEmailValidated(false);
        }

        if (password === '') {
            setPasswordValidated(true);
        } else {
            setPasswordValidated(false);
        }

        if (username !== '' && password !== '' && email !== '') {
            tryToRegister();
        } else {
            setLoading(false);
        }
    }

    async function tryToRegister() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/register', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                setLoading(false);
                navigation.navigate('Login', { post: 'Račun registriran. Prijavite se.' });
            }
            else if (responseStatus == 304) {
                setUsername('');
                setPassword('');
                setEmail('');
                setSnackText('Korisnik već postoji.');
                setVisible(true);
                setLoading(false);
            }
            else {
                setUsername('');
                setPassword('');
                setEmail('');
                setSnackText('Greška:' + responseStatus);
                setVisible(true);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/bckg.png')} style={{
                flex: 1,
                resizeMode: "cover",
                justifyContent: "center"
            }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={verifyInput}
                    />
                }
                >
                    <View style={styles.container}>
                        <View style={{ paddingTop: "10%", paddingBottom: "5%" }}>
                            <Avatar.Icon size={90} icon="account" color={Colors.white} style={{ alignSelf: "center" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: "5%" }}>
                                <View style={{ flex: 1 }}></View>
                                <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: "0.2%", marginTop: "8.4%" }} />
                                <Title style={{ flex: 2.8, paddingTop: "2.5%", textAlign: "center" }}>Registracija</Title>
                                <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: "0.2%", marginTop: "8.4%" }} />
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </View>
                        <TextInput
                            label='Email'
                            error={emailValidated}
                            theme={{ roundness: 50 }}
                            style={{ backgroundColor: '#FFF6F2', marginLeft: "6%", marginRight: "6%" }}
                            mode='outlined'
                            onChangeText={text => {
                                setEmail(text.toString());
                                setEmailValidated(false);
                            }}
                            value={email}
                        />
                        <TextInput
                            label='Korisničko ime'
                            error={usernameValidated}
                            theme={{ roundness: 50 }}
                            style={{ backgroundColor: '#FFF6F2', marginLeft: "6%", marginRight: "6%" }}
                            mode='outlined'
                            onChangeText={text => {
                                setUsername(text.toString());
                                setUsernameValidated(false);
                            }}
                            value={username}
                        />
                        <TextInput
                            label='Lozinka'
                            error={passwordValidated}
                            theme={{ roundness: 50 }}
                            style={{ backgroundColor: '#FFF6F2', marginLeft: "6%", marginRight: "6%" }}
                            mode='outlined'
                            secureTextEntry={true}
                            onChangeText={text => {
                                setPassword(text.toString());
                                setPasswordValidated(false);
                            }}
                            value={password}
                        />
                        <View style={{ paddingTop: "16%" }}>
                            <Button
                                theme={{ roundness: 50 }}
                                style={{ paddingTop: "2%", paddingBottom: "2%", marginLeft: "6%", marginRight: "6%" }}
                                mode="contained"
                                onPress={verifyInput}
                            >
                                Registrirajte se
                    </Button>
                        </View>
                        <View style={{ paddingTop: "12%" }}>
                            <Divider style={{ backgroundColor: '#1D9044', padding: "0.2%" }} />
                            <Button
                                theme={{ roundness: 5 }}
                                style={{ paddingTop: "2%", paddingBottom: "2%", marginLeft: "6%", marginRight: "6%" }}
                                mode="text"
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text>Prijava</Text>
                            </Button>
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
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: "6%",
        paddingRight: "6%"
    },
});