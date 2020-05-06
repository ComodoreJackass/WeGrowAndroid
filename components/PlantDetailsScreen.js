import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, BackHandler, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, Headline, ProgressBar, Colors, List, Checkbox, Subheading, Divider } from 'react-native-paper';

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
                <ImageBackground source={require('../assets/bckg.png')} style={{
                    flex: 1,
                    resizeMode: "cover",
                }}>
                    <ScrollView>
                        <Card style={styles.card}>
                            <Card.Cover source={require('../assets/placeholder.png')} style={{ marginLeft: 15, marginRight: 15 }}/>
                            <Card.Content style={{ padding: 15 }}>
                                <Subheading>Vrsta: povrće </Subheading>
                                <Subheading>Vrijeme uzgoja: {route.params.duration} dana </Subheading>
                                <Subheading>Proteklo vrijeme: {route.params.elapsedTime}</Subheading>

                                <Divider style={{ marginBottom: 10, marginTop: 10 }} />

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

                                <Divider style={{ marginBottom: 10, marginTop: 10 }} />

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
        backgroundColor: '#F1E3C8',
        paddingTop:10,
    },
    row: {
        paddingTop: 40,
        paddingBottom: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});