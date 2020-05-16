import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ImageBackground, ActivityIndicator, Text } from 'react-native';
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
                            <Title style={{ flex: 1.4, paddingTop: "2.5%", textAlign: "center" }}>Prijava</Title>
                            <Divider style={{ flex: 1, backgroundColor: '#1D9044', padding: "0.2%", marginTop: "8.4%" }} />
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>
                    <TextInput
                        label='Korisničko ime'
                        mode='outlined'
                        theme={{ roundness: 50 }}
                        style={{ backgroundColor: '#FFF6F2', marginLeft: "6%", marginRight: "6%" }}
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
                        style={{ backgroundColor: '#FFF6F2', marginLeft: "6%", marginRight: "6%" }}
                        error={passwordValidated}
                        secureTextEntry={true}
                        onChangeText={text => {
                            setPassword(text.toString());
                            setPasswordValidated(false);
                        }}
                        value={password}
                    />
                    <View style={{ paddingTop: "28%" }}>
                        <Button
                            theme={{ roundness: 50 }}
                            style={{ paddingTop: "2%", paddingBottom: "2%", marginLeft: "6%", marginRight: "6%" }}
                            mode="contained"
                            onPress={verifyInput}
                        >
                            Prijavi me
                        </Button>
                    </View>
                    <View style={{ paddingTop: "20%" }}>
                        <Divider style={{ backgroundColor: '#1D9044', padding: "0.2%" }} />
                        <Button
                            theme={{ roundness: 5 }}
                            style={{ paddingTop: "2%", paddingBottom: "4%" }}
                            mode="text"
                            onPress={() => navigation.navigate('Register')}
                        ><Text upercase={false}>
                                Izrada računa
                            </Text>
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
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: "6%",
        paddingRight: "6%"
    },
});