import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet,SafeAreaView,TouchableOpacity,FlatList,KeyboardAvoidingView,TextInput,Keyboard, Button} from "react-native";
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as Location from 'expo-location';

export default class QuickSearchResults extends Component {
    constructor(props){
        super(props);
        this.user = firebase.auth().currentUser;
        this.itemsRef = db.collection("items");
        this.state = {
            results: []
        }
    }

    searchItem = (searchItem, supermarkets) => {
        let count = 0;
        supermarkets.forEach((sMark) => {
            let itemCheck = this.itemsRef.where("supid", "==", sMark.supid).where("brand","==",searchItem.brand).where("product","==", searchItem.product);
        
            itemCheck.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    count++;
                    console.log(count, doc.data(), sMark.name);
                    this.setState({
                        results: [...this.state.results, {
                            supermarket: sMark.name,
                            supid: sMark.supid,
                            product: doc.data().product,
                            price: doc.data().price,
                            coordinates: {lat: sMark.coordinates.U, long: sMark.coordinates.k}
                        }]
                    })
                })
            })
        })
    }

    renderResult = (item) => {
        return (
            <TouchableOpacity style={styles.button}
                onPress = {() => {
                    this.props.navigation.navigate('Map',
                    {
                        item: item.product,
                        supermarket: item.supermarket,
                        coordinates: {lat: item.coordinates.lat, long: item.coordinates.long}
                    });
                }}
            >
                <Text style = {{fontWeight: "300"}}>
                    {`${item.supermarket} \nPrice: $ ${item.price}`}
                </Text>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        this.searchItem(this.props.navigation.state.params.searchItem,
            this.props.navigation.state.params.supermarkets);
    }

    componentWillUnmount() {

    }

    render(){
        const supermarkets = this.props.navigation.state.params.supermarkets;
        const searchItem = this.props.navigation.state.params.searchItem;
        return (
            <SafeAreaView>
                <View>
        <Text style = {{fontSize: 24, fontWeight: "400"}}> {searchItem.product} ({searchItem.brand})</Text>
                </View>
                <View>
                    <FlatList
                        data = {this.state.results} 
                        keyExtractor ={item => item.supid}
                        renderItem={({item}) => this.renderResult(item)}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: "flex-start",
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth
      },
})