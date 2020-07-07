import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet, TouchableOpacity,Modal} from 'react-native';

export default class Search extends Component {
    constructor() {
        super();
        this.user = firebase.auth().currentUser;
        this.state = {
            orderedList: {}
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View>
                <Text> Search </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

});