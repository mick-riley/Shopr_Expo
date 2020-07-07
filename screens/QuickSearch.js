import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet,SafeAreaView,TouchableOpacity,FlatList,KeyboardAvoidingView,TextInput,Keyboard} from "react-native";
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as Location from 'expo-location';
import * as geofirestore from 'geofirestore';

export default class QuickSearch extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Quick Search"
        }
    }

    constructor() {
        super();
        this.user = firebase.auth().currentUser;
        this.itemsRef = db.collection("items");
        this.supermarketsRef = db.collection("supermarkets");
        this.state = {
            supermarkets: [],
            autoCompleteItems: [],
            selectedItem: {},
            selectionMade: false,
            errorMessage: "",
            location: {lat: 18.007708, long: -76.743189,}
        }
    }

    getUniqueItems = (querySnapshot) => {
        let items = [];
        let counter = 0;
        querySnapshot.forEach((res) => {
            let label = res.data().product + " | " + res.data().brand;
            if (!items.includes(label)){
                items.push({id: counter, name: label});
                counter += 1;
            }
        });
        this.setState({autoCompleteItems: items});
    }

    _getLocation = async () => {
        let status = await Location.requestPermissionsAsync();

        if (status !== "granted"){
            this.setState({errorMessage: "Permission not granted"});
        }

        Location.getCurrentPositionAsync({})
        .then( userlocation => {
            let lat = userlocation.coords.latitude;
            let long = userlocation.coords.longitude;
            this.setState({location: {lat, long}});
            console.log(this.state.location);
        }).catch( err => {
            console.error(err);
        })
    }
    

    searchSupermarkets = () => {
        this._getLocation();
    }

    supermarketPull = (querySnapshot) => {
        let supermarkets = [];
        let counter = 0;

        const geoStore = geofirestore.initializeApp(db);

        const geoCollection = geoStore.collection("geoReferencedSupermarkets");

        querySnapshot.forEach((res) => {
            counter += 1;
            geoCollection.doc(counter.toString()).set({
                name: res.data().name,
                coordinates: res.data().location,
                identifier: res.data().supid
            }).then(result => {
                return ;
            }).catch(err => {
                console.error(err);
            });
        });

        let currentLat = this.state.location.lat;
        let currentLong = this.state.location.long;
        const query = geoCollection.near({center: new firebase.firestore.GeoPoint(currentLat, currentLong), radius: 5});

        query.get().then( querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    supermarkets: [...this.state.supermarkets, {
                        name: doc.data().name,
                        supid: doc.data().identifier,
                        coordinates: doc.data().coordinates
                    }]})
            })
        });
        
    }

    componentDidMount() {
        this.getListItems = this.itemsRef.onSnapshot(this.getUniqueItems);
        this._getLocation();
        this.getSupermarkets = this.supermarketsRef.onSnapshot(this.supermarketPull);
    }

    componentWillUnmount() {
        this.getListItems();
        this.getSupermarkets();
    }

    render() {
        return (
            <SafeAreaView style = {styles.container}>
                <View style = {[styles.section, {flex: 1}]}>
                    <SearchableDropdown 
                        onItemSelect={(item) => {
                            let adder = item.name.split("|");
                            const product = adder[0].trim();
                            const brand = adder[1].trim(); 
                            this.setState({selectedItem: {product, brand}, selectionMade: true});
                            }}
                        containerStyle={{ padding: 5 }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                            }}
                        itemTextStyle={{ color: 'black' }}
                        itemsContainerStyle={{ maxHeight: 200}}
                        items={this.state.autoCompleteItems}
                        resetValue={true}
                        textInputProps={
                        {
                            placeholder: "Rice",
                            underlineColorAndroid: "transparent",
                            style: {
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                                color: "#000"
                            },
                        }
                        }
                        listProps={
                        {
                            nestedScrollEnabled: true,
                        }
                        }
                    />
                </View>
                <View style = {[styles.section, {flex: 1}]}>
                    {
                        this.state.selectionMade ? 
                        <Text style = {styles.selection}>
                        {this.state.selectedItem.product} ({this.state.selectedItem.brand})
                        </Text>
                        : null
                    }
                </View>
                <View style = {[styles.section, {flex: 1}]}>
                    {
                        this.state.selectionMade ? 
                        <TouchableOpacity style={styles.addGrocery} onPress = {() => {
                            this.props.navigation.navigate("QuickSearchResults",
                                {
                                    searchItem: this.state.selectedItem,
                                    location: this.state.location,
                                    supermarkets: this.state.supermarkets
                                })
                            }
                        }>
                            <Text style={styles.addButton}>Search</Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems:"center"
    },
    section: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: "flex-start"
    },
    header:{
        justifyContent: "flex-start",
        marginLeft:64,
        marginTop: 100,
        fontWeight: "400",
        fontSize: 28,
        borderBottomWidth: 1.5,
        borderBottomColor:'#CC2D6F'
    },
    title: {
        fontSize:28,
        fontWeight:'700',
    },
    itemCount:{
        marginTop: 4,
        marginBottom: 16,
        color: "grey",
        fontWeight:"600"
    },
     footer: {
         paddingHorizontal: 32,
         flexDirection: "row",
         alignItems: "center"
    },
     input: {
        flex:1,
        maxHeight:32,
        alignContent: "flex-start",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
        borderColor: "#CC2D6F"
    },
     inputComplete: {
        maxHeight: 40
    },
     addGrocery : {
         borderRadius: 4,
         padding:16,
         //alignItems: "center",
         backgroundColor: "#CC2D6F"
    },
     dropdown: {
         borderRadius: 3,
         alignContent: "flex-start",
         justifyContent: "flex-start"
    },
});