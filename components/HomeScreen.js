import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert, Text, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Colors, ProgressBar, Subheading, IconButton, Appbar, TextInput, Divider } from 'react-native-paper';
import TrackedCard from './TrackedCard'

export default function HomeScreen({ navigation, navigation: { setParams }, route }) {
  const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
  const [userId, setUserId] = useState(route.params.userId);

  const [notificationSent, setNotificationSent] = useState(false);

  const [progress, setProgress] = useState([]);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [progressFetched, setProgressFetched] = useState(false);
  const [plants, setPlants] = useState([]);

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
        setRefreshing(false);
      }
      else {
        console.log(responseStatus + " " + userId + " " + jsonToken);
        setRefreshing(false);
      }
    } catch (error) {
      console.error(error);
      setRefreshing(false);
    }
  }

  async function tryToGetPlants() {
    try {
      let response = await fetch('https://afternoon-depths-99413.herokuapp.com/plants', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + jsonToken
        }
      });
      let responseStatus = await response.status;

      if (responseStatus == 200) {
        let json = await response.json();
        setPlants(json);
        tryToLogIn();
      }
      else {
        console.log(responseStatus + " " + userId + " " + jsonToken);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function elapsedTime(time) {
    let days = Math.floor((Date.now() - time) / (60000 * 60 * 24));
    let hours = Math.floor((Date.now() - time) / (60000 * 60)) % 24;

    let elapsedTime = days + "d " + hours + "h";
    return elapsedTime

  }

  useEffect(() => {
    tryToGetPlants();
  }, [jsonToken, userId]);

  useEffect(() => {
    progress.sort((a, b) => { return a.id < b.id });

    let tmp = progress.filter(prog => !prog.done).map(prog => (
      <TrackedCard
        key={prog.id}
        jsonToken={jsonToken}
        userId={userId}
        progressId={prog.id}
        plantName={prog.plant.name}
        pic={plants[prog.plant.id - 1].image}
        elapsedTime={elapsedTime(Date.parse(prog.started_on))}
        duration={prog.growth_stage.stage_duration}
        plantCare={prog.growth_stage.next_stage_text}
        plantInstructions={prog.growth_stage.description}
        hasSensors={prog.has_sensors}
        prog={prog}
        onRefresh={onRefresh}
        navigation={navigation}
        notificationSent={notificationSent}
        setNotificationSent={setNotificationSent}
      />
    ));

    setCards(tmp);

  }, [progress])

  const onRefresh = () => {
    setRefreshing(true);
    tryToGetPlants().then(() => {
      setRefreshing(false);
    }
    );
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
          <Subheading
            style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 200 }}
          >
            Učitavanje...
          </Subheading>}
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
});