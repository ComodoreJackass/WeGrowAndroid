import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, BackHandler } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, Headline, ProgressBar, Colors, List, Checkbox, Subheading } from 'react-native-paper';

export default function PlantDetailsScreen({ navigation, route }) {
    const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
    const [userId, setUserId] = useState(route.params.userId);
    const [progressId, setProgressId] = useState(route.params.progressId);

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
                    <Subheading>Naziv: {route.params.plantName}</Subheading>
                    <Subheading>Vrsta: povrće </Subheading>
                    <Subheading>Vrijeme uzgoja: {route.params.duration} dana </Subheading>
                    <Subheading>Proteklo vrijeme: {route.params.elapsedTime}</Subheading>

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

                    <List.Section style={{marginLeft:-20}}>
                        <List.Accordion
                            title="Briga o biljci"
                            left={props => <List.Icon {...props} icon="sprout" />}
                        >
                            <Subheading style={{marginLeft:-20, paddingRight:10}}>{route.params.plantCare}</Subheading>
                        </List.Accordion>
                        <List.Accordion
                            title="Upute za sadnju"
                            left={props => <List.Icon {...props} icon="shovel" />}
                        >
                            <Subheading style={{marginLeft:-20, paddingRight:10}}>{route.params.plantInstructions}</Subheading>
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