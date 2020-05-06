import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert, Text, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Colors, ProgressBar, Subheading, Searchbar, Appbar, TextInput, Divider } from 'react-native-paper';

export default function HomeScreen({ navigation, navigation: { setParams }, route }) {
  const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
  const [userId, setUserId] = useState(route.params.userId);

  const [progress, setProgress] = useState([]);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [progressFetched, setProgressFetched] = useState(false);

  /**
   *  Refresh if card was added
   */
  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', (e) => {
      console.log(route.params.testParam);

      if (route.params.testParam) {
        navigation.setParams({ testParam: false });
        onRefresh();
      }
    });

    return unsubscribe;
  }, [route.params.testParam]);

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
        setProgressFetched(true);
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

  function elapsedTime(time) {
    let days = Math.floor((Date.now() - time) / (60000 * 60 * 24));
    let hours = Math.floor((Date.now() - time) / (60000 * 60)) % 24;

    let elapsedTime = "";

    if (days == 0) {
      elapsedTime += "0 dana ";
    } else if (days == 1) {
      elapsedTime += days + " dan ";
    } else {
      elapsedTime += days + " dana ";
    }

    if (hours == 0) {
      elapsedTime += "0 sati";
    } else if (hours == 1) {
      elapsedTime += hours + " sat ";
    } else {
      elapsedTime += hours + " sata ";
    }

    return elapsedTime

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

  useEffect(() => {
    tryToLogIn();
  }, [jsonToken, userId]);

  useEffect(() => {
    let tmp = progress.map(prog => (
      <Card key={prog.id} style={styles.card} onPress={() => {
        navigation.navigate('Details', {
          jsonToken: jsonToken,
          userId: userId,
          progressId: prog.id,
          plantName: prog.plant.name,
          elapsedTime: elapsedTime(Date.parse(prog.started_on)),
          duration: prog.growth_stage.stage_duration,
          plantCare: prog.growth_stage.next_stage_text,
          plantInstructions: prog.growth_stage.description
        })
      }}>
        <Card.Title title={prog.plant.name} subtitle={prog.growth_stage.stage_title} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
        <Card.Content>
          <Subheading>Očekivano vrijeme uzgoja:</Subheading>
          <Paragraph>{prog.growth_stage.stage_duration} dana</Paragraph>
          <Divider style={{ marginBottom: 10, marginTop: 10 }} />
          <Subheading>Proteklo vrijeme:</Subheading>
          <Paragraph>{elapsedTime(Date.parse(prog.started_on))}</Paragraph>
          <View style={{ paddingTop: 10, width: 150 }}>
            <ProgressBar progress={calculateProgress(Date.parse(prog.started_on), prog.growth_stage.stage_duration)} color={Colors.green500} />
          </View>
          <Divider style={{ marginTop: 30 }} />
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
    <View style={{ flex: 1, backgroundColor: '#F1E3C8' }}>
      <ScrollView
        style={styles.container} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {progressFetched
          ?
          cards.length > 0
            ?
            cards
            :
            <Subheading
              style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 200 }}
            >
              Swajpate lijevo kako bi dodali biljku na ekran za praćenje.
            </Subheading>
          :
          <View style={{ flex: 1, backgroundColor: '#F1E3C8' }}></View>}
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5
  },
  card: {
    borderWidth: 10,
    borderColor: '#FFF0E9',
    marginBottom: 10,
    borderRadius: 6
  }
});