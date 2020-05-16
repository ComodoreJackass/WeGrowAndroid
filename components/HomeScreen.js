import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, BackHandler, Alert, Text, ImageBackground } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Colors, ProgressBar, Subheading, IconButton, Appbar, TextInput, Divider } from 'react-native-paper';

export default function HomeScreen({ navigation, navigation: { setParams }, route }) {
  const [jsonToken, setJsonToken] = useState(route.params.jsonToken);
  const [userId, setUserId] = useState(route.params.userId);

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
        onRefresh();
      }
      else {
        console.log(responseStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }


  async function watered(progId) {
    try {
      let response = await fetch('https://afternoon-depths-99413.herokuapp.com/progress/lastWateredOn', {
        method: 'PATCH',
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
        console.log("Done");
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

    let elapsedTime = days + "d " + hours + "h";
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


  function calculateProgressPerHour(started, expected) {

    let expectedDays = parseInt(expected.split("-")[0]) * 24;
    let currDiff = Math.floor((Date.now() - started) / (60000 * 60));

    if (currDiff > 0) {
      return currDiff / expectedDays;
    }
    else {
      return 0;
    }
  }

  useEffect(() => {
    tryToGetPlants();
  }, [jsonToken, userId]);

  useEffect(() => {
    progress.sort((a, b) => { return a.id < b.id });

    let tmp = progress.filter(prog => !prog.done).map(prog => (
      <Card key={prog.id} style={styles.card} onPress={() => {
        navigation.navigate('Details', {
          jsonToken: jsonToken,
          userId: userId,
          progressId: prog.id,
          plantName: prog.plant.name,
          pic: plants[prog.plant.id - 1].image,
          elapsedTime: elapsedTime(Date.parse(prog.started_on)),
          duration: prog.growth_stage.stage_duration,
          plantCare: prog.growth_stage.next_stage_text,
          plantInstructions: prog.growth_stage.description,
          hasSensors: prog.has_sensors
        })
      }}>
        <ImageBackground source={{ uri: `data:image/jpg;base64,${plants[prog.plant.id - 1].image}` }} style={{
          flex: 1,
          resizeMode: "cover"
        }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <Card.Title title={prog.plant.name} subtitle={prog.growth_stage.stage_title} titleStyle={{ color: "#FFF0E9" }} subtitleStyle={{ color: "#FFF0E9" }} left={(props) => <Avatar.Icon {...props} icon="flower" />} />
          </View>
        </ImageBackground>
        <Card.Content>
          <Subheading>Očekivano vrijeme uzgoja:</Subheading>
          <Paragraph>{prog.growth_stage.stage_duration} dana</Paragraph>
          <Divider style={{ marginBottom: 10, marginTop: 10 }} />
          <Subheading>Proteklo vrijeme od sadnje:</Subheading>
          <Paragraph>{elapsedTime(Date.parse(prog.started_on))}</Paragraph>
          <View style={{ paddingTop: 10, width: 200 }}>
            <ProgressBar progress={calculateProgress(Date.parse(prog.started_on), prog.growth_stage.stage_duration)} color={Colors.green500} />
          </View>
          <Divider style={{ marginBottom: 10, marginTop: 20 }} />
          <Subheading>Zadnje zalijevanje prije:</Subheading>
          <Paragraph>{elapsedTime(Date.parse(prog.last_watered_on))}</Paragraph>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems:"center" }}>
            <View style={{ paddingTop: 10, width: 200 }}>
              <ProgressBar progress={1 - calculateProgressPerHour(Date.parse(prog.last_watered_on), "2-3")} color={Colors.blue300} />
            </View>
            <IconButton
              icon="water-outline"
              onPress={() => watered(prog.id)}
            />
          </View>

          <Divider style={{ marginTop: 30 }} />
        </Card.Content>
        <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5 }}>
          <Button
            onPress={() => tryToDelete(prog.id)}
          >Obriši</Button>
          <Button
            onPress={() => moveToDone(prog.id)}
          >Gotovo</Button>
        </Card.Actions>
      </Card >
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
  card: {
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderRadius: 6
  }
});