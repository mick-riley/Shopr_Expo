import React, { Component } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';


export default class Logo extends Component {
    render() {
        return(
        <View style={styles.container}>
        <Image
      style={{width: 100, height: 100}}
      source={require('../images/shoprlogoo.png')}/>
      </View>
    );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 60,
    },
});

