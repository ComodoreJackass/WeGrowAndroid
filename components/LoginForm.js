import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar, TextInput, Title, Avatar, Colors, Divider } from 'react-native-paper';

export default function LoginForm({ navigation, route }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

        if (password === '') {
            setPasswordValidated(true);
        } else {
            setPasswordValidated(false);
        }

        if (username !== '' && password !== '') {
            tryToLogIn();
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
                navigation.navigate('Tab', {
                    jsonToken: json.accessToken,
                    userId: json.userId,
                    username: username,
                    password: password
                });
            }
            else {
                setUsername('');
                setPassword('');
                setSnackText('Korisničko ime ili lozinka ne postoje');
                setVisible(true);
                console.log(response.status);
            }
        } catch (error) {
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
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ paddingTop: 40, paddingBottom: 40 }}>
                    <Avatar.Icon size={90} icon="account" color={Colors.white} style={{ alignSelf: "center" }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <View style={{ flex: 1 }}></View>
                        <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: 1, marginTop: 24 }} />
                        <Title style={{ flex: 1.4, paddingTop: 5, textAlign: "center" }}>Prijava</Title>
                        <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: 1, marginTop: 24 }} />
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
                <TextInput
                    label='Korisničko ime'
                    mode='outlined'
                    theme={{ roundness: 50 }}
                    style={{ backgroundColor: '#FFF6F2' }}
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
                    style={{ backgroundColor: '#FFF6F2' }}
                    error={passwordValidated}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setPassword(text.toString());
                        setPasswordValidated(false);
                    }}
                    value={password}
                />
                <View style={{ paddingTop: 50 }}>
                    <Button
                        theme={{ roundness: 50 }}
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                        mode="contained"
                        onPress={verifyInput}
                    >
                        Prijavite se
                    </Button>
                </View>
                <View style={{ paddingTop: 80 }}>
                    <Divider style={{ backgroundColor: '#1D9044', padding: 1 }} />
                    <Button
                        theme={{ roundness: 5 }}
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                        mode="text"
                        onPress={() => navigation.navigate('Register')}
                    >
                        Registracija
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F1E3C8'
    },
});