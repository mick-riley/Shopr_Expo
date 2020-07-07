import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar} from 'react-native';
import Logo from '../components/Logo';
import * as firebase from 'firebase';

import {db} from '../functions/Fire';


export default class Register extends Component {

    

    static navigationOptions = {
        headerShown: false
        };
        
    state = {
        name: "",
        email: "",
        password: "",
        errorMessage: null
    };

/* 
writeUserData = uid => {
        const docRef = db.doc(`users/${uid}`);
        docRef.set({
            lists: {},
            name: this.state.name,
            listedItems: []
          })
          .then(console.log("successfully added user"))
          .catch(err => {
            console.log(err);
          });
      };
*/

    handleSignUp = () => {
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
            res.user.updateProfile({
                displayName: this.state.name
            }).then(() => {
                console.log(res.user.displayName);
            }).catch(error => {
                console.log("No update made");
            });
            return ;
        })
        .catch(error => this.setState({ errorMessage: error.message }));
        this.props.navigation.navigate("Loading");
    };

    render() {
        return(
            <View style = {styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <Logo/>
                    <Text style = {styles.greeting}> {`Welcome to ShopR ! \n Create an Account`} </Text>
            
                    <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style ={styles.form}>
                    <View>
                        <TextInput style={styles.inputName}
                        autoCapitalize="none"
                        placeholder = 'Full Name'
                        placeholderTextColor = 'black'
                        autoCapitalize='none'
                        returnKeyType="next"
                        autoCorrect={false}
                        onChangeText={name => {
                            this.setState({name});
                            console.log(this.state.name);
                        }}
                        value={this.state.name}
                        >
                        </TextInput>
                    </View>
                    <View>
                        <TextInput style={styles.inputEmail}
                        autoCapitalize="none"
                        placeholder = 'Email Address'
                        placeholderTextColor = 'black'
                        autoCapitalize='none'
                        keyboardType="email-address"
                        returnKeyType="next"
                        autoCorrect={false}
                        onChangeText={email => this.setState({email})}
                        value={this.state.email}
                        >
                        </TextInput>
                    </View>

                    <View style = {styles.form}>
                        <View>
                            <TextInput style = {styles.inputPassword}
                            autoCapitalize="none"
                            placeholder = 'Password'
                            placeholderTextColor = 'black'
                            returnKeyType="go"
                            secureTextEntry={true}
                            onChangeText={password => this.setState({password})}
                        value={this.state.password}
                            ></TextInput>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style= {styles.button} onPress={this.handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
               
                <Text style={styles.forgotpassword}> Forgot Password ?</Text>

                <View style ={styles.signupTextCont}>
                <Text style={styles.signupText}> Already Have A Shopr Account?</Text> 
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
              <Text style={styles.signupButton}> Login 
              </Text>
              
              </TouchableOpacity>
              </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    greeting: {
        marginTop:12,
        fontSize:28,
        fontWeight: '600',
        textAlign: 'center',
        color: '#002ADD',
        marginVertical: 10
    },
    inputName:{
        width:300,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        fontSize: 20,
        color:'black',
        paddingTop:10,
    },
    inputEmail:{
        width:300,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        fontSize: 20,
        color:'black',
        paddingTop:40,
        
        },
        inputPassword:{
            width:300,
            borderBottomColor: 'grey',
            borderBottomWidth: 2,
            fontSize: 20,
            color:'black',
            paddingTop:40,
        },
        button:{
            width:250,
            borderRadius:25,
            backgroundColor: '#000000',
            marginVertical:40 ,
            paddingVertical:6,
        },
        buttonText:{
            fontSize:30,
            fontWeight: 'bold',
            color:'#ffffff',
            textAlign:'center',
        },
        forgotpassword:{
            paddingLeft: 180,
            color:'#002ADD',
            fontWeight:'bold',
        },

        signupText: {
            color: 'black',
            fontSize:18,
            fontWeight: '500',
          },

          signupButton:{
            color:'#002ADD',
            fontSize:20,
            fontWeight: 'bold',
          },
          signupTextCont:{
            flexDirection:'row',
            paddingVertical:80,
        },
        errorMessage: {
            height: 72,
            alignItems: "center",
            justifyContent: "center",
        },
        error: {
            color: "#FF0000",
            fontSize: 15,
            fontWeight: "600",
            textAlign: "center"
        },
   
    
});



