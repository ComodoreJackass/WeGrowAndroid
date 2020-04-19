import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';

export default function HomeScreen({ navigation, route }) {
  const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
  const [userId, setUserId] = useState(route.params.userId);

  const [progress, setProgress] = useState([]);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    tryToLogIn();
  }, [jsonToken, userId]);

  useEffect(() => {
    let tmp = progress.map(prog => (
      <Card key={prog.id} style={styles.card} >
        <Card.Title title={prog.plant.name} subtitle={prog.growth_stage.stage_title} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
        <Card.Content>
          <Title>Stage duration</Title>
          <Paragraph>{prog.growth_stage.stage_duration} days</Paragraph>
          <Title>Stage started on</Title>
          <Paragraph>{prog.started_on}</Paragraph>
        </Card.Content>
      </Card>
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
    <View style={styles.container}>
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
        {cards}
      </ScrollView>
      <Appbar>
        <Appbar.Action
          icon="flower-outline"
          onPress={() => navigation.navigate('Plants', {
            jsonToken: jsonToken,
            userId: userId
          })}
        />
        <Appbar.Action
          icon="clipboard-text-outline"
          onPress={() => navigation.navigate('Home', {
            jsonToken: jsonToken,
            userId: userId
          })}
        />
        <Appbar.Action
          icon="account"
          onPress={() => navigation.navigate('User', {
            jsonToken: jsonToken,
            userId: userId
          })}
        />
      </Appbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6
  },
});