import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet,SafeAreaView,TouchableOpacity,FlatList,KeyboardAvoidingView,TextInput,Keyboard, Button} from "react-native";
import * as Location from 'expo-location';
import * as geofirestore from 'geofirestore';

export default class SearchItemsReview extends Component {
    constructor(props){
        super(props);
        this.itemsRef = db.collection("items");
        this.supermarketsRef = db.collection("supermarkets");
        this.state = {
            list: props.navigation.state.params.list,
            supermarkets: [],
            location: {lat: 18.007708, long: -76.743189}
        }
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
                        coordinates: {lat: doc.data().coordinates.U, long: doc.data().coordinates.k}
                    }]})
            })
        });
        
    }

    componentDidMount() {
        this._getLocation();
        this.getSupermarkets = this.supermarketsRef.onSnapshot(this.supermarketPull);
    }

    componentWillUnmount() {
        this.getSupermarkets();
    }


    renderList = item => {
        return (
            <View>
                <View>
                    <Text> {item.product} ({item.brand}) </Text>
                    <Text> Quantity: {item.quantity} </Text>
                </View>
            </View>
        )
    }


    render(){
        return (
            <View>
                <View>
                    <FlatList  
                        data = {this.state.list}
                        keyExtractor = {(item,index) => index.toString()}
                        renderItem = {({item}) => this.renderList(item)}
                    />
                </View>
                <View>
                    <Button
                        title = "Confirm"
                        onPress = {() => {
                            //console.log("confirmation");
                            
                            this.props.navigation.navigate("Processor",
                            {
                                list: this.state.list,
                                supermarkets: this.state.supermarkets,
                                budget: this.props.navigation.state.params.budget
                            })
                        }}
                    />
                </View>
            </View>
        )
    }
}