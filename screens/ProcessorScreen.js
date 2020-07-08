import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {ActivityIndicator, View, Text, StyleSheet,SafeAreaView,TouchableOpacity,FlatList,KeyboardAvoidingView,TextInput,Keyboard, Button} from "react-native";
import * as Location from 'expo-location';
import * as geofirestore from 'geofirestore';

export default class ProcessorScreen extends Component {
    constructor(props){
        super(props);
        this.itemsRef = db.collection("items");
        this.state = {
            list: props.navigation.state.params.list,
            supermarkets: props.navigation.state.params.supermarkets,
            itemPriceData: [],
            budget: props.navigation.state.params.budget,
            results: [],
            loading: true
        }
    }

    componentDidMount(){
        this.searchItems(this.state.list, this.state.supermarkets);
    }

    componentDidUpdate(previousProps, previousState){
        if (previousState.itemPriceData !== this.state.itemPriceData){
            this.knapsack(this.state.itemPriceData);
        }
    }


   


    knapsackHelper = (W, wt, val, n) => {
        let results = [];
        let K = new Array(n + 1);
        for (var i = 0; i < n+1; i++) {
          K[i] = new Array(W+1);
        }
        
        for (var s = 0; s < n+1; s++) {
          for (var j = 0; j < W+1; j++) {
            K[s][j] = 0;
          }
        }
        
        for (var x = 0; x <= n; x++) {
          for (var w = 0; w <= W; w++) {
            if (x == 0 || w == 0) {
              K[x][w] = 0;
            }
            else if (wt[x - 1] <= w) {
              K[x][w] = Math.max(val[x - 1] + K[x - 1][w - wt[x - 1]],
                K[x - 1][w]);
            } else {
              K[x][w] = K[x - 1][w];
            }
          }
        }
      
        res = K[n][W];
      
        g = W
        for (var v = n; v > 0; v--){
            if (res<=0){
                break;
            }
            if (res==K[v-1][g]){
                continue
            } else {
                results.push(wt[v-1]/100);
                res = res - val[v-1];
                g = wt[v-1];
            }
        };
              
        return results;
    }


    unpackItemData = (itemData) => {
        let weights = [];
        let values = [];
        let items = [];

        itemData.forEach(item => {
            item.vwRatio = item.value/item.price;
        })

        itemData.sort((a,b) => (a.vwRatio > b.vwRatio) ? 1 : -1)

        itemData.forEach(item => {
            for (var i = 1; i <= item.quantity; i++){
                weights.push(item.price*100);
                values.push(item.value);
            }
        })
        return {weights, values, items};
    }

    searchItems = (items, supermarkets) => {
        console.log("SEPARATOR");
        supermarkets.forEach((sMark) => {
            let supermarketArray = [];
            items.forEach((item) => {
                let itemCheck = this.itemsRef.where("supid", "==", sMark.supid)
                    .where("brand","==",item.brand)
                    .where("product","==", item.product);

                itemCheck.get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        supermarketArray.push({
                            product: doc.data().product,
                            brand: doc.data().brand,
                            price: doc.data().price,
                            value: item.value,
                            quantity: item.quantity
                        });
                    });
                });
            });
            setTimeout(() => {
                if (supermarketArray.length !== 0) {
                    this.setState({
                        itemPriceData: [...this.state.itemPriceData,
                        {
                            supermarket: sMark.name,
                            supid: sMark.supid,
                            location: {lat: sMark.coordinates.lat, long: sMark.coordinates.long},
                            itemData: supermarketArray
                        }]
                    })
                }
            },5000);    
        });
    }

    knapsack = (supermarketItems) => {
        const budget = this.state.budget * 100;
        let ourItems = [];
        let imResults = [];
        let itemResults = [];

        supermarketItems.forEach((supermarketData) => {
            let checker = this.unpackItemData(supermarketData.itemData);
            supermarketData.values = checker.values;
            supermarketData.weights = checker.weights;
            ourItems.push(supermarketData);;
        })
        ourItems.forEach(bag => {
            let length = bag.weights.length;
            result = this.knapsackHelper(budget, bag.weights, bag.values, length);
            imResults.push({
                sName: bag.supermarket, 
                sLocation: bag.location,
                results: result,
                items: []
            });
        })
        //console.log(imResults);
        imResults.forEach(bag => {
            bag.totalCost = 0;
            let obj = ourItems.find(o => o.supermarket == bag.sName);
            bag.results.forEach(result => {
                let search = obj.itemData.find(n => n.price === result);
                bag.items = [... bag.items, {
                    product: search.product,
                    brand: search.brand,
                    price: result
                }];
                bag.totalCost += result;
            });
        });
        this.setState({
            results: imResults,
            loading: false
        })
    }

    renderItem = (item) => {
        return (
            <View>
            </View>
        )
    }

    renderResult = (item) => {
        console.log(item);
        return (
            <TouchableOpacity style={styles.button}
                onPress = {() => {
                    this.props.navigation.navigate('Map',
                    {
                        item: "Shopping List",
                        supermarket: item.sName,
                        coordinates: {lat: item.sLocation.lat, long: item.sLocation.long}
                    });
                }}
            >
                <Text style = {{fontWeight: "300"}}>
                    {`${item.sName} \n`}
                </Text>
                <Text>Total number of items: {item.items.length}</Text>
                <Text>Total Cost: ${item.totalCost}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style = {styles.containers}>
                { this.state.loading && this.state.results.length == 0 ?
                    <View>
                        <Text>Please wait while we find your supermarkets</Text> 
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                :
                    <View>
                        <FlatList
                            data = {this.state.results}
                            keyExtractor = {(item,index) => index.toString()}
                            renderItem = {({item}) => this.renderResult(item)}
                        />
                    </View>
                }   
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containers: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});