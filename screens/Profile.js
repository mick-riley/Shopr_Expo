import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import * as firebase from "firebase";

export default class LoadingScreen extends React.Component {
    signOutUser = () => {
        firebase.auth().signOut();
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.signOutUser}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});