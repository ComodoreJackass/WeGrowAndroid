import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, BackHandler } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, Headline, ProgressBar, Colors, List, Checkbox, Subheading } from 'react-native-paper';

export default function PlantDetailsScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [progressId, setProgressId] = useState(route.params.progressId);

    const [progress, setProgress] = useState({});
    const [conditions, setConditions] = useState({});

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Tab', {
                jsonToken: jsonToken,
                userId: userId
            });
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    useEffect(() => {
        tryToGetInfo();
    }, [jsonToken, userId, progressId]);

    async function tryToGetInfo() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/byId', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    userId: userId
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                let json = await response.json();

                json.forEach(element => {
                    if (element.id == progressId) {
                        setProgress(element);
                        tryToGetConditions(element.growth_stage.growth_id)
                    }
                });
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function tryToGetConditions(growthCondition) {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/growthConditions/byId', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jsonToken
                },
                body: JSON.stringify({
                    growthConditionsId: growthCondition
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                let json = await response.json();

                json.forEach(element => {
                    if (element.id == growthCondition) {
                        setConditions(element);
                    }
                });
            }
            else {
                console.log(responseStatus + " " + userId + " " + jsonToken);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [plantName, setPlantName] = useState('');
    const [stageTitle, setStageTitle] = useState('');
    const [stageDuration, setStageDuration] = useState('');


    useEffect(() => {
        if (Object.keys(progress).length !== 0) {
            setPlantName(progress.plant.name);
            setStageTitle(progress.growth_stage.stage_title)
            setStageDuration(progress.growth_stage.stage_duration)
        }
    }, [conditions]);

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction
                    onPress={() => navigation.navigate('Tab', {
                        jsonToken: jsonToken,
                        userId: userId
                    })}
                />
                <Appbar.Content
                    title="Detalji"
                />
            </Appbar.Header>
            <View style={styles.container}>
                <ScrollView>
                    <Subheading>Naziv: {plantName}</Subheading>
                    <Subheading>Vrsta: povrće </Subheading>
                    <Subheading>Vrijeme uzgoja: {stageDuration} dana </Subheading>
                    <Subheading>Proteklo vrijeme: koliko god dana</Subheading>

                    <View style={styles.row}>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <Paragraph>Voda</Paragraph>
                            <ProgressBar progress={0.5} color={Colors.blue500} style={{ width: 100 }} />
                        </View>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <Paragraph>Temperatura</Paragraph>
                            <ProgressBar progress={0.5} color={Colors.red800} style={{ width: 100 }} />
                        </View>
                    </View>

                    <List.Section>
                        <List.Accordion
                            title="Briga o biljci"
                            left={props => <List.Icon {...props} icon="sprout" />}
                        >
                            <List.Item title="First item" />
                            <List.Item title="Second item" />
                        </List.Accordion>
                        <List.Accordion
                            title="Upute za sadnju"
                            left={props => <List.Icon {...props} icon="shovel" />}
                        >
                            <List.Item title="First item" />
                            <List.Item title="Second item" />
                        </List.Accordion>
                    </List.Section>

                </ScrollView>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E3C8',
        padding: 10,
        paddingTop: 20,
    },
    row: {
        paddingTop: 40,
        paddingBottom: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});