import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
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
                <View style={styles.container}>
                    <View style={{ paddingTop: 40, paddingBottom: 20 }}>
                        <Avatar.Icon size={90} icon="account" color={Colors.white} style={{ alignSelf: "center" }} />
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom:20 }}>
                            <View style={{ flex: 1 }}></View>
                            <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: 1, marginTop: 24 }} />
                            <Title style={{ flex: 2.8, paddingTop: 5, textAlign: "center" }}>Registracija</Title>
                            <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: 1, marginTop: 24 }} />
                            <View style={{ flex: 1 }}></View>
                        </View>
                        {loading && <Portal.Host><ActivityIndicator color={"#fff"} size={'large'} /></Portal.Host>}
                    </View>
                    <TextInput
                        label='Email'
                        error={emailValidated}
                        theme={{ roundness: 50 }}
                        style={{ backgroundColor: '#FFF6F2', marginLeft:"10%", marginRight:"10%" }}
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
                        style={{ backgroundColor: '#FFF6F2',  marginLeft:"10%", marginRight:"10%" }}
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
                        style={{ backgroundColor: '#FFF6F2', marginLeft:"10%", marginRight:"10%" }}
                        mode='outlined'
                        secureTextEntry={true}
                        onChangeText={text => {
                            setPassword(text.toString());
                            setPasswordValidated(false);
                        }}
                        value={password}
                    />
                    <View style={{ paddingTop: 30 }}>
                        <Button
                            theme={{ roundness: 50 }}
                            style={{ paddingTop: 10, paddingBottom: 10, marginLeft:"10%", marginRight:"10%" }}
                            mode="contained"
                            onPress={verifyInput}
                        >
                            Registrirajte se
                    </Button>
                    </View>
                    <View style={{ paddingTop: 40 }}>
                        <Divider style={{ backgroundColor: '#1D9044', padding: 1 }} />
                        <Button
                            theme={{ roundness: 5 }}
                            style={{ paddingTop: 10, paddingBottom: 10, marginLeft:"10%", marginRight:"10%" }}
                            mode="text"
                            onPress={() => navigation.navigate('Login')}
                        >
                            Prijava
                    </Button>
                    </View>
                </View>
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
        padding: 20,
    },
});