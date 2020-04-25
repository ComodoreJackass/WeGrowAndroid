import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, Colors, ProgressBar } from 'react-native-paper';


export default function HomeScreen({ navigation, route }) {
  const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
  const [userId, setUserId] = useState(route.params.userId);

  const [progress, setProgress] = useState([]);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Izađi iz aplikacije", "Želite li izači iz aplikacije", [
        {
          text: "Ostani",
          onPress: () => null,
        },
        { text: "Izađi", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };


    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  async function tryToLogIn() {
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
        setProgress(json);
      }
      else {
        console.log(responseStatus + " " + userId + " " + jsonToken);
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
        onRefresh();
      }
      else {
        console.log(responseStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    tryToLogIn();
  }, [jsonToken, userId]);

  useEffect(() => {
    let tmp = progress.map(prog => (
      <Card key={prog.id} style={styles.card} onPress={() => {
        navigation.navigate('Details', {
          jsonToken: jsonToken,
          userId: userId,
          progressId: prog.id
        })
      }}>
        <Card.Title title={prog.plant.name} subtitle={prog.growth_stage.stage_title} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
        <Card.Content>
          <Title>Očekivano vrijeme uzgoja</Title>
          <Paragraph>{prog.growth_stage.stage_duration} dana</Paragraph>
          <Title>Proteklo vrijeme</Title>
          <Paragraph>{prog.started_on}</Paragraph>
          <ProgressBar progress={0.5} color={Colors.green500} style={{ width: 100 }} />
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => tryToDelete(prog.id)}
          >Obriši</Button>
        </Card.Actions>
      </Card >
    ));

    setCards(tmp);

  }, [progress])

  const onRefresh = () => {
    setRefreshing(true);
    tryToLogIn().then(() => {
      setRefreshing(false);
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
        {cards}
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1E3C8',
    padding: 10
  },
  card: {
    borderWidth: 10,
    borderColor: '#FFF0E9',
    marginBottom: 10,
    borderRadius: 6
  },
});