import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert, Text, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Colors, ProgressBar, Subheading, IconButton, Appbar, TextInput, Divider } from 'react-native-paper';
import PushNotification from "react-native-push-notification";

export default function TrackedCard(props) {

    useEffect(()=>{
        console.log(props.prog.last_watered_on);
        calculateProgressPerHour(Date.parse(props.prog.last_watered_on), "2-3");
    }, []);

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
            message: "Prošlo je više od 48h od posljednjeg zalijevanja", // (required)
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
    }

    function calculateProgress(started, expected) {

        let expectedDays = parseInt(expected.split("-")[0]);
        let currDiff = Math.floor((Date.now() - started) / (60000 * 60 * 24));

        if (currDiff > 0) {
            return currDiff / expectedDays;
        }
        else {
            return 0;
        }
    }

    function calculateProgressPerHour(started, expected) {

        let expectedDays = parseInt(expected.split("-")[0]) * 24;
        let currDiff = Math.floor((Date.now() - started) / (60000 * 60));

        if (currDiff > 0) {
            // if more then 2 days have passed
            if (currDiff / expectedDays > 1.1 && !props.notificationSent) {
                props.setNotificationSent(true);
                props.notificationSent = true;
                pushNotification(props.plantName);
            }

            return currDiff / expectedDays;
        }
        else {
            return 0;
        }
    }

    function elapsedTime(time) {
        let days = Math.floor((Date.now() - time) / (60000 * 60 * 24));
        let hours = Math.floor((Date.now() - time) / (60000 * 60)) % 24;

        let elapsedTime = days + "d " + hours + "h";
        return elapsedTime

    }

    async function watered(progId) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/lastWateredOn', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + props.jsonToken
                },
                body: JSON.stringify({
                    progressId: progId
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                console.log("Done");
                props.onRefresh();
            }
            else {
                console.log(responseStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Card
            style={{
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginBottom: 10,
                marginTop: 10,
                borderRadius: 6
            }}
            onPress={() => {
                props.navigation.navigate('Details', {
                    jsonToken: props.jsonToken,
                    userId: props.userId,
                    progressId: props.progressId,
                    plantName: props.plantName,
                    pic: props.pic,
                    elapsedTime: props.elapsedTime,
                    duration: props.duration,
                    plantCare: props.plantCare,
                    plantInstructions: props.plantInstructions,
                    hasSensors: props.hasSensors
                })
            }}>
            <Image source={{ uri: `data:image/jpg;base64,${props.pic}` }} style={{
                flex: 1,
                resizeMode: "cover",
                height: 100,
                borderRadius: 10,
                marginTop: -5,
                marginLeft: -1,
                marginRight: -1
            }}>
            </Image>
            <Card.Content>
                <View style={{ flexDirection: "column", justifyContent: "center", alignItems:'center', paddingTop: 10 }}>
                    <Subheading style={{textAlign:'center'}}>{props.prog.plant.name}</Subheading>
                    <Text style={{marginTop:5}}>U sadnji: {elapsedTime(Date.parse(props.prog.started_on))}</Text>
                    <Text style={{ marginTop: 10 }}>Zadnje zalijevanje:</Text>
                    <View style={{ flexDirection: "row", width: '100%', alignItems:'center', justifyContent:'center' }}>
                        <Text>{elapsedTime(Date.parse(props.prog.last_watered_on))}</Text>
                        <IconButton
                            icon="water-outline"
                            onPress={() => watered(props.prog.id)}
                            color='#77B5FE'
                        />
                    </View>
                </View>
            </Card.Content>
        </Card >
    );
}

//<Paragraph>{props.prog.growth_stage.stage_duration} dana</Paragraph>