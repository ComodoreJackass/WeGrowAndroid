
import React, { useEffect, useState } from 'react';
import { BackHandler, View, ScrollView, StyleSheet, Text, TouchableOpacity, ImageBackground, Image, TextInput } from 'react-native';
import { Avatar, Button, Subheading, Title, Appbar, Card, Paragraph, Divider, List, RadioButton, Snackbar, ActivityIndicator } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

export default function InsertPlant({ navigation, route }) {
    const [plantName, setPlantName] = useState('');
    const [plantDescription, setPlantDescription] = useState('');
    const [plantDifficulty, setPlantDifficulty] = useState('');
    const [plantCare, setPlantCare] = useState('');
    const [plantInstuctions, setPlantInstructions] = useState('');
    const [category, setCategory] = useState('Voće');
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [materials, setMaterials] = useState('');
    const [visible, setVisible] = useState(false);
    const [snackText, setSnackText] = useState('');
    const [loading, setLoading] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    const [image, setImage] = useState('');

    const options = {
        title: 'Odaberite sliku biljke',
        maxWidth: 255,
        maxHeight: 255,
        quality: 1,
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

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

    const addImage = () => ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            //const source = { uri: response.uri };

            // You can also display the image using data:
            //const source = { uri: 'data:image/jpeg;base64,' + response.data };

            //small images pls
            setImage(response.data);
        }
    });

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

    function validateInput() {
        if (plantName === '') {
            setSnackText('Naziv biljke ne smije biti prazan')
            setVisible(true);
        } else if (plantDescription === '') {
            setSnackText('Opis biljke ne smije biti prazan')
            setVisible(true);
        } else if (plantDifficulty === '') {
            setSnackText('Težina uzgoja ne smije biti prazna')
            setVisible(true);
        } else if (plantCare === '') {
            setSnackText('Briga o biljci ne smije biti prazna')
            setVisible(true);
        } else if (plantInstuctions === '') {
            setSnackText('Upute za sadnju ne smiju biti prazne')
            setVisible(true);
        } else if (category === '') {
            setSnackText('Kategorija biljke ne smije biti prazna')
            setVisible(true);
        } else if (min === '') {
            setSnackText('Min vrijeme uzgoja ne smije biti prazno')
            setVisible(true);
        } else if (max == '') {
            setSnackText('Max vrijeme uzgoja ne smije biti prazno')
            setVisible(true);
        } else if (materials == '') {
            setSnackText('Materijali ne smiju biti prazni')
            setVisible(true);
        } else if (image == '') {
            setSnackText('Slika ne smije biti prazna')
            setVisible(true);
        } else {
            setLoading(true);
            tryToAdd();
        }
    }

    async function tryToAdd() {
        try {
            let response = await fetch('https://afternoon-depths-99413.herokuapp.com/plants/insert', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + route.params.jsonToken
                },
                body: JSON.stringify({
                    name: plantName,
                    summary: plantDescription,
                    difficulty: plantDifficulty,
                    category: category,
                    owner: route.params.username,
                    care: plantCare,
                    instructions: plantInstuctions,
                    duration: `${min}-${max}`,
                    image: image,
                    materials: materials
                }),
            });
            let responseStatus = await response.status;

            if (responseStatus == 200) {
                navigation.navigate('Plants')
                console.log("Added");
                setLoading(false);
            }
            else {
                console.log(responseStatus);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/background.png')} style={{
                flex: 1,
                resizeMode: "cover",
                paddingTop: 10
            }}>
                <ScrollView>
                    <Card style={styles.card}>
                        <Card.Content style={{ padding: 15, paddingTop: 10 }}>
                            <Title style={{ textAlign: 'center', paddingBottom: 10 }}>Dodavanje biljke</Title>
                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: '#799EAE',
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center'
                                }}
                                multiline
                                onChangeText={text => {
                                    setPlantName(text.toString());
                                }}
                                value={plantName}
                                placeholder="Naziv biljke"
                                placeholderTextColor="#799EAE"
                            />

                            {
                                image != '' && <Image source={{ uri: `data:image/jpg;base64,${image}` }} style={{
                                    flex: 1,
                                    resizeMode: "cover",
                                    height: 200,
                                    marginTop: 10,
                                    marginBottom: 10
                                }} />
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 10 }}>
                                <TouchableOpacity
                                    onPress={() => addImage()}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Dodaj sliku
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setImage('')}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Obriši sliku
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <RadioButton.Group
                                onValueChange={value => setCategory(value)}
                                value={category}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <View>
                                        <Text>Voće</Text>
                                        <RadioButton value="Voće" />
                                    </View>
                                    <View>
                                        <Text>Povrće</Text>
                                        <RadioButton value="Povrće" />
                                    </View>
                                    <View>
                                        <Text>Cvijeće</Text>
                                        <RadioButton value="Cvijeće" />
                                    </View>
                                    <View>
                                        <Text>Začini</Text>
                                        <RadioButton value="Začini" />
                                    </View>
                                </View>
                            </RadioButton.Group>

                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center', marginTop: 5, borderColor: '#799EAE',
                                    borderRadius: 12,
                                }}
                                multiline
                                onChangeText={text => {
                                    setPlantDescription(text.toString());
                                }}
                                value={plantDescription}
                                placeholder={"Opis biljke"}
                                placeholderTextColor="#799EAE"
                            />

                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center', marginTop: 10, borderColor: '#799EAE',
                                    borderRadius: 12,
                                }}
                                multiline
                                onChangeText={text => {
                                    setPlantDifficulty(text.toString());
                                }}
                                value={plantDifficulty}
                                placeholder={"Težina uzgoja"}
                                placeholderTextColor="#799EAE"
                            />

                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center', marginTop: 10, borderColor: '#799EAE',
                                    borderRadius: 12,
                                }}
                                multiline
                                onChangeText={text => {
                                    setPlantInstructions(text.toString());
                                }}
                                value={plantInstuctions}
                                placeholder={"Upute za sadnju"}
                                placeholderTextColor="#799EAE"
                            />

                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center', marginTop: 10, borderColor: '#799EAE',
                                    borderRadius: 12,
                                }}
                                multiline
                                onChangeText={text => {
                                    setPlantCare(text.toString());
                                }}
                                value={plantCare}
                                placeholder={"Briga o biljci"}
                                placeholderTextColor="#799EAE"
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                                <TextInput
                                    placeholder="Min vrijeme uzgoja"
                                    underlineColorAndroid='transparent'
                                    style={styles.TextInputStyle}
                                    keyboardType={'numeric'}
                                    style={{
                                        width: '43%',
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        padding: 2,
                                        alignSelf: 'center', borderColor: '#799EAE',
                                        borderRadius: 12,
                                    }}
                                    onChangeText={text => {
                                        setMin(text.toString());
                                    }}
                                    value={min}
                                    placeholderTextColor="#799EAE"
                                />
                                <TextInput
                                    placeholder="Max vrijeme uzgoja"
                                    underlineColorAndroid='transparent'
                                    style={styles.TextInputStyle}
                                    keyboardType={'numeric'}
                                    style={{
                                        width: '43%',
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        padding: 2,
                                        alignSelf: 'center', borderColor: '#799EAE',
                                        borderRadius: 12,
                                    }}
                                    onChangeText={text => {
                                        setMax(text.toString());
                                    }}
                                    value={max}
                                    placeholderTextColor="#799EAE"
                                />
                            </View>

                            <TextInput
                                style={{
                                    width: '90%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 2,
                                    alignSelf: 'center', marginTop: 10, borderColor: '#799EAE',
                                    borderRadius: 12,
                                    marginBottom:5
                                }}
                                multiline
                                onChangeText={text => {
                                    setMaterials(text.toString());
                                }}
                                value={materials}
                                placeholder={"Materijali npr. vaza;zemlja;mreza"}
                                placeholderTextColor="#799EAE"
                            />

                            <ActivityIndicator animating={loading} color={'purple'}/>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, paddingBottom: 10 }}>
                                <TouchableOpacity
                                    onPress={() => validateInput()}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Dodaj biljku
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Plants')}
                                >
                                    <Text style={{ color: '#799EAE', fontSize: 16 }}>
                                        Odustani
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card.Content>
                    </Card>
                </ScrollView>
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            onToggleSnackBar
                        },
                    }}
                >
                    {snackText}
                </Snackbar>
            </ImageBackground>
        </View >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    card: {
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 30,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    card2: {
        marginTop: "3%",
        borderRadius: 0,
    }
});