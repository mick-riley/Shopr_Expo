import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import GroceryListDetails from "../screens/GroceryListDetails";
import { db } from "../functions/Fire";

export default class GroceryList extends Component {
    constructor() {
        super();
        this.state ={ 
            showListVisible : false,
            uniqueItems: []
        };
    }

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible})
    }

    

    componentDidMount(){
        
    }

    componentWillUnmount(){
    }

    render () {
        const list = this.props.list;
        const completedCount = 1;
        const remainingCount = 0;

        return (
        <View>
                <Text style ={styles.listTitle} numberofLine={1}>
                    {list.name}
                </Text>
                <Text style ={styles.listTitle} numberofLine={1}>
                    $ {list.budget} 
                </Text>
        </View>
    );

}

};

const styles = StyleSheet.create({

    listTitle:{
    fontSize: 20,
    fontWeight: "500",
    marginBottom:10,
    }
})
