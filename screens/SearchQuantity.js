import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet, TouchableOpacity,Modal, FlatList, SafeAreaView, Button} from 'react-native';
import ListItem from '../components/ListItem';

export default class SearchQuantity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.navigation.state.params.list
        }
    }


    componentDidMount() {
        this.setState({list: this.props.navigation.state.params.list});
    }

    updateQuantity = (item) => {
        this.setState(state => {
            const list = state.list.map((listItem, j) => {
                if (listItem.id === item.id) {
                    return {
                        id: item.id,
                        product: item.product,
                        brand: item.brand,
                        value: item.value,
                        quantity: item.quantity
                    }
                } else {
                    return listItem;
                }
            });
            return {
            list,
            };
        });
        };

    renderList = item => {
        return (
            <View>
                <ListItem item = {item} updateQuantity = {this.updateQuantity}/>
            </View>
        )
    }


    render() {
        return (
            <View>
                <View>
                    <FlatList
                    data = {this.state.list}
                    keyExtractor = {(item, index) => index.toString()}
                    renderItem = {({item}) => this.renderList(item)}
                    />
                </View>
                <View>
                    <Button 
                        title = "Submit"
                        onPress = {() => {
                                this.props.navigation.navigate('ItemsReview',
                                {
                                    list: this.state.list,
                                    budget: this.props.navigation.state.params.budget
                                }) 
                            }
                        }
                    />
                </View>
            </View>
        )
    }
}