import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';

export default function LoginForm({ navigation, route }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameValidated, setUsernameValidated] = useState(false);
    const [passwordValidated, setPasswordValidated] = useState(false);
    //Necesary to verify user upon sending requests to other endpoints
    const [jsonToken, setJsonToken] = useState('');
    //User id, will be used for further requests
    const [userId, setUserId] = useState(0);
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
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                let json = await response.json();
                setJsonToken(json.accessToken);
                setUserId(json.userId);
                navigation.navigate('Home', {
                    jsonToken: jsonToken,
                    userId: userId
                });
            }
            else {
                setUsername('');
                setPassword('');
                setSnackText('Username or password not found');
                setVisible(true);
                console.log(responseStatus);
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
        <View style={styles.container}>
            <TextInput
                label='Username'
                error={usernameValidated}
                onChangeText={text => {
                    setUsername(text.toString());
                    setUsernameValidated(false);
                }}
                value={username}
            />
            <TextInput
                label='Password'
                error={passwordValidated}
                secureTextEntry={true}
                onChangeText={text => {
                    setPassword(text.toString());
                    setPasswordValidated(false);
                }}
                value={password}
            />
            <Button
                theme={{ roundness: 5 }}
                mode="contained"
                onPress={verifyInput}
            >
                Login
            </Button>
            <Button
                theme={{ roundness: 5 }}
                mode="text"
                onPress={() => navigation.navigate('Register')}
            >
                Register
            </Button>
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
        flex: 1
    },
});