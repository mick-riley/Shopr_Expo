import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class SupermarketMap extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const lat = this.props.navigation.state.params.coordinates.lat;
        const long = this.props.navigation.state.params.coordinates.long;
        return (
                <MapView style = {styles.map}
                    initialRegion={{
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                <Marker
                    coordinate={{
                        latitude: lat,
                        longitude: long, 
                    }}
                    title = "Den"
                    description = {`Foska Oats\n$212.75`}
                />
                </MapView>
        )
    }
}

const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});