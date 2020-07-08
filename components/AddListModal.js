import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

Icon.loadFont();



export default class AddListModal extends Component {
    state = {
        listName: "",
        budget: "",
    };

    createTodo = () => {

        const {listName,budget} = this.state;

        const list = {listName,budget};

        this.props.addList(list);

        /*this.setState({listName:""});
        this.setState({budget:""});*/
        this.props.closeModal();
    }

    render() {
        return(
            <KeyboardAvoidingView style ={styles.container} behavior="padding">
                <TouchableOpacity style = {{ position: "absolute", top:64,right :32, }} onPress={this.props.closeModal}>
                <Icon name="ios-close" size={30} color="black" />
                </TouchableOpacity>

                <View style ={styles.lists}>
                    <Text style = {styles.createList}> Create New Shopping List </Text>

                    <TextInput style = {styles.listInput}
                    placeholder ='Enter Name of List'
                    onChangeText = {text => this.setState({ listName: text})}
                    value = {this.state.listName}
                    />

                    <TextInput 
                        style = {styles.listInput}
                        placeholder ='Enter Budget'
                        onChangeText = {text => {
                            this.setState({ budget: text});
                            console.log(this.state.budget);
                        }}
                        value = {this.state.budget}
                        keyboardType = {"numeric"}
                    />
                    
                    <TouchableOpacity style={styles.addList} onPress={this.createTodo}>
                        <Text style ={styles.saveButton}> Save </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lists :{
        alignSelf: "stretch",
        marginHorizontal: 32,
    },
    createList : {
        fontSize: 28,
        fontWeight: "700",
        color: 'black',
        alignSelf: "center",
        marginBottom: 16
    },
    listInput :{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize:18
    },
    addList: {
       
        marginTop:20,
        height: 50,
        borderRadius:6,
        alignItems: "center",
        backgroundColor: '#002ADD',
        justifyContent: "center"
    },
    saveButton: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize:24
    },
    close: {
        fontSize: 24,
    }
});