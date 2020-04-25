import React, { Component, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { TextInput, Snackbar, Title, Avatar, Colors } from 'react-native-paper';

export default function RegisterForm({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailValidated, setEmailValidated] = useState(false);
    const [usernameValidated, setUsernameValidated] = useState(false);
    const [passwordValidated, setPasswordValidated] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackText, setSnackText] = useState('');

    const verifyInput = () => {
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
                navigation.navigate('Login', { post: 'Account created. Please log in.' });
            }
            else if (responseStatus == 304) {
                setUsername('');
                setPassword('');
                setEmail('');
                setSnackText('Account already exists.');
                setVisible(true);
            }
            else {
                setUsername('');
                setPassword('');
                setEmail('');
                setSnackText('Something went wrong' + responseStatus);
                setVisible(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: 40, paddingBottom: 40 }}>
                <Avatar.Icon size={80} icon="account" color={Colors.white} style={{ alignSelf: "center" }} />
                <Title style={{ alignSelf: "center", paddingTop: 5 }}>Registracija</Title>
            </View>
            <TextInput
                label='Email'
                error={emailValidated}
                style={{ backgroundColor: '#C1DFB7' }}
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
                style={{ backgroundColor: '#C1DFB7' }}
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
                style={{ backgroundColor: '#C1DFB7' }}
                mode='outlined'
                secureTextEntry={true}
                onChangeText={text => {
                    setPassword(text.toString());
                    setPasswordValidated(false);
                }}
                value={password}
            />
            <View style={{ paddingTop: 50 }}>
                <Button
                    theme={{ roundness: 5 }}
                    style={{paddingTop:10, paddingBottom:10}}
                    mode="contained"
                    onPress={verifyInput}
                >
                    Registrirajte se
                </Button>
                <Button
                    theme={{ roundness: 5 }}
                    style={{paddingTop:10, paddingBottom:10}}
                    mode="text"
                    onPress={() => navigation.navigate('Login')}
                >
                    Prijava
                </Button>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F1E3C8',
    },
});