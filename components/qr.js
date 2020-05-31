
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    Dimensions
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default function ScanScreen({ navigation, route }) {

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Plants')
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    async function tryToAdd(plantId) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/insert', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + route.params.jsonToken
                },
                body: JSON.stringify({
                    userId: route.params.userId,
                    plantId: plantId,
                    done: false
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                navigation.navigate('Home', { testParam: true, })
                console.log("Added");
            }
            else {
                console.log(responseStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onSuccess = e => {
        try {
            let tmp = JSON.parse(e.data);

            if (tmp.plantzilla != null) {
                console.log("nice");
                tryToAdd(tmp.plantzilla);
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <QRCodeScanner
            onRead={onSuccess}
            cameraStyle={styles.cameraContainer}
            topViewStyle={styles.zeroContainer}
            bottomViewStyle={styles.zeroContainer}

        />
    );
}
const styles = StyleSheet.create({
    zeroContainer: {
        height: 0,
        flex: 0,
    },

    cameraContainer: {
        height: Dimensions.get('window').height,
    },
});