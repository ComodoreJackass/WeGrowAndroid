import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, BackHandler, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { TouchableRipple, Button, Card, Title, Paragraph, Appbar, TextInput, ProgressBar, Colors, List, Portal, Dialog, Subheading, Divider } from 'react-native-paper';
import mqtt from 'mqtt/dist/mqtt';
import PushNotification from "react-native-push-notification";

var client; //= mqtt.connect("mqtts://m24.cloudmqtt.com:30991", { clientId: "jelMeNekoTrazio", username: "web", password: "a" });

export default function PlantDetailsScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [progressId, setProgressId] = useState(route.params.progressId);
    const [pic, setPic] = useState(route.params.pic);
    const [showDialog, setShowDialog] = useState(false);
    const [enableSensors, setEnableSensors] = useState(route.params.hasSensors);

    const [tmpZraka, setTmpZraka] = useState('X');
    const [progTmpZraka, setProgTmpZraka] = useState(0);

    const [tmpTla, setTmpTla] = useState('X');
    const [progTmpTla, setProgTmpTla] = useState(0);

    const [vlagaZraka, setVlagaZraka] = useState('X');
    const [progVlagaZraka, setProgVlagaZraka] = useState(0);

    const [vlagaTla, setVlagaTla] = useState('X');
    const [progVlagaTla, setProgVlagaTla] = useState(0);

    const [notification, setNotification] = useState(false);

    PushNotification.configure({
        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);

            // process the notification

            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: Platform.OS === 'ios'
    });

    const pushNotification = (title) => {
        PushNotification.localNotification({
            /* Android Only Properties */
            id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: "some_tag", // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

            /* iOS and Android properties */
            title: title, // (optional)
            message: "Razina vlage je pala ispod 20%", // (required)
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    useEffect(() => {
        const backAction = () => {
            unsubscribe();
            navigation.navigate('Home', { testParam: true, })
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    const subscribeToTopics = () => {

        client = mqtt.connect("mqtts://m24.cloudmqtt.com:30991", { clientId: "jelMeNekoTrazio", username: "web", password: "a" });
        console.log("connected flag  " + client.connected);

        setTmpZraka("...");
        setTmpTla("...");
        setVlagaTla("...");
        setVlagaZraka("...");

        client.on("connect", function () {
            console.log("connected  " + client.connected);
        })

        console.log("subscribing to topics");
        client.subscribe({
            "s1/tmpzrak": { qos: 0 },
            "s1/tmptlo": { qos: 0 },
            "s1/vlzrak": { qos: 0 },
            "s1/vltlo": { qos: 0 },
        });

        console.log("listening")
        client.on("error", function (error) {
            console.log("Can't connect" + error);
            process.exit(1)
        });

        client.on('message', function (topic, message, packet) {
            console.log("message is " + message);
            console.log("topic is " + topic);

            if (topic === "s1/tmpzrak") {
                setTmpZraka(message.toString() + '°C');
                setProgTmpZraka((parseFloat(message.toString()) + 40) / 100);
            }
            else if (topic === "s1/tmptlo") {
                setTmpTla(message.toString() + '°C');
                setProgTmpTla((parseFloat(message.toString()) + 40) / 100);
            }
            else if (topic === "s1/vlzrak") {
                setVlagaZraka(message.toString() + '%');
                setProgVlagaZraka((parseFloat(message.toString()) / 100));
            }
            else if (topic === "s1/vltlo") {
                setVlagaTla(message.toString() + '%');
                setProgVlagaTla((parseFloat(message.toString())) / 100);

                if (parseFloat(message.toString()) < 20 && !notification) {
                    setNotification(true);
                    pushNotification(route.params.plantName);
                }
            }
        });

        console.log("end of script");
    };

    useEffect(() => {
        if (enableSensors) {
            subscribeToTopics();
        }
    }, [enableSensors]);

    async function setSensors(progId, sensor) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/sensors', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    progressId: progId,
                    sensors: sensor
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus === 200) {
                console.log("Sensors added");
            }
            else {
                console.log(responseStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const unsubscribe = () => {
        if (client != null) {
            client.end();
        }
        setTmpZraka("X");
        setTmpTla("X");
        setVlagaTla("X");
        setVlagaZraka("X");
    }

    async function moveToDone(progId) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/done', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    progressId: progId,
                    done: 1
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                console.log("Done");
                navigation.navigate('Home', { testParam: true, })
                //props.onRefresh();
            }
            else {
                console.log(responseStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function tryToDelete(progId) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    progressId: progId
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                console.log("Deleted");
                navigation.navigate('Home', { testParam: true, })
                //props.onRefresh();
            }
            else {
                console.log(responseStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header theme={{ colors: { primary: "#EFF0EF" } }}>
                <Appbar.BackAction
                    onPress={() => navigation.navigate('Tab', {
                        jsonToken: jsonToken,
                        userId: userId
                    })}
                    color='#D06F6F'
                />
                <Appbar.Content
                    title={route.params.plantName}
                    titleStyle={{ color: '#D06F6F' }}
                />
            </Appbar.Header>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/background.png')} style={{
                    flex: 1,
                    resizeMode: "cover",
                }}>
                    <ScrollView style={{ paddingTop: 5 }}>
                        <Card style={styles.card}>
                            <Image source={{ uri: `data:image/jpg;base64,${pic}` }} style={{
                                flex: 1,
                                resizeMode: "cover",
                                height: 200,
                                borderRadius: 20,
                                marginTop: -18,
                                marginLeft: -10,
                                marginRight: -10
                            }}>
                            </Image>
                            <Card.Content style={{ padding: 15 }}>
                                <Subheading>Vrijeme uzgoja: {route.params.duration} dana </Subheading>
                                <Subheading style={{ marginTop: 5 }}>Proteklo vrijeme: {route.params.elapsedTime}</Subheading>
                                <TouchableOpacity onPress={() => {
                                    setShowDialog(true);
                                }}>
                                    <View>
                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                        <Portal>
                                            <Dialog
                                                visible={showDialog}
                                                onDismiss={() => setShowDialog(false)}>
                                                {!enableSensors
                                                    ?
                                                    <View>
                                                        <Dialog.Title>Povezivanje sa senzorima</Dialog.Title>
                                                        <Dialog.Content>
                                                            <Paragraph>Unesite id i lozinku senzora kako bi započeli pračenje razvoja biljke.</Paragraph>
                                                            <TextInput
                                                                label='id'
                                                            />
                                                            <TextInput
                                                                label='lozinka'
                                                                secureTextEntry={true}
                                                            />
                                                        </Dialog.Content>
                                                        <Dialog.Actions>
                                                            <Button onPress={() => setShowDialog(false)}>Odustani</Button>
                                                            <Button onPress={() => { subscribeToTopics(); setEnableSensors(true); setSensors(progressId, 1); setShowDialog(false); }}>Spoji me</Button>
                                                        </Dialog.Actions>
                                                    </View>
                                                    :
                                                    <View>
                                                        <Dialog.Title>Raskid veze sa senzorima</Dialog.Title>
                                                        <Dialog.Content>
                                                            <Paragraph>Želite li prestati pratiti biljku.</Paragraph>
                                                        </Dialog.Content>
                                                        <Dialog.Actions>
                                                            <Button onPress={() => setShowDialog(false)}>Odustani</Button>
                                                            <Button onPress={() => { setEnableSensors(false); setSensors(progressId, 0); unsubscribe(); setShowDialog(false); }}>Raskini vezu</Button>
                                                        </Dialog.Actions>
                                                    </View>
                                                }
                                            </Dialog>
                                        </Portal>

                                        {
                                            enableSensors
                                                ?
                                                <View>
                                                    <View style={styles.row2}>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1
                                                        }}>
                                                            <Paragraph>Vlaga zraka {vlagaZraka}</Paragraph>
                                                            <ProgressBar progress={progVlagaZraka} color={Colors.blue500} style={{ width: 100 }} />
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1
                                                        }}>
                                                            <Paragraph>Tmp zraka: {tmpZraka}</Paragraph>
                                                            <ProgressBar progress={progTmpZraka} color={Colors.red800} style={{ width: 100 }} />
                                                        </View>
                                                    </View>
                                                    <View style={styles.row2}>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1
                                                        }}>
                                                            <Paragraph>Vlaga tla: {vlagaTla}</Paragraph>
                                                            <ProgressBar progress={progVlagaTla} color={Colors.blue500} style={{ width: 100 }} />
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1
                                                        }}>
                                                            <Paragraph>Tmp tla: {tmpTla}</Paragraph>
                                                            <ProgressBar progress={progTmpTla} color={Colors.red800} style={{ width: 100 }} />
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                <Paragraph style={{ marginBottom: 20, marginTop: 20 }}>Dodirnite kako bi spojili senzore.</Paragraph>
                                        }
                                        <Divider style={{ marginBottom: 10, marginTop: 10 }} />
                                    </View>
                                </TouchableOpacity>
                                <List.Section style={{ marginLeft: -20 }}>
                                    <List.Accordion
                                        title="Briga o biljci"
                                        left={props => <List.Icon {...props} icon="sprout" />}
                                    >
                                        <Subheading style={{ marginLeft: -20, paddingRight: 10 }}>{route.params.plantCare}</Subheading>
                                    </List.Accordion>
                                    <List.Accordion
                                        title="Upute za sadnju"
                                        left={props => <List.Icon {...props} icon="shovel" />}
                                    >
                                        <Subheading style={{ marginLeft: -20, paddingRight: 10 }}>{route.params.plantInstructions}</Subheading>
                                    </List.Accordion>
                                </List.Section>
                            </Card.Content>
                            <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5 }}>
                                <TouchableOpacity
                                    onPress={() => tryToDelete(progressId)}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Obriši
                            </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => moveToDone(progressId)}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Gotovo
                            </Text>
                                </TouchableOpacity>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    row: {
        paddingTop: 40,
        paddingBottom: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    row2: {
        paddingBottom: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
});