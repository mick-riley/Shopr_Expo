import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Logo from '../components/Logo';
import * as firebase from 'firebase';

export default class Login extends Component {
    static navigationOptions = {
        headerShown: false
        };

    state = {
        email: "",
        password: "",
        errorMessage: null
    };
    handleLogin = () => {
        const { email, password } = this.state;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => this.setState({ errorMessage: error.message }));
    };

    render() {
        return(
            <View style = {styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>
                <Logo/>
                    <Text style = {styles.greeting}> {`Welcome Back ! \n Sign In to Continue`} </Text>
            
                    <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style ={styles.form}>
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
                <TouchableOpacity style= {styles.button} onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
               
                <Text style={styles.forgotpassword}> Forgot Password ?</Text>

                <View style ={styles.signupTextCont}>
                <Text style={styles.signupText}> Don't Have A Shopr Account?</Text> 
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")}>
              <Text style={styles.signupButton}> Sign Up 
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
    inputEmail:{
        width:300,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        fontSize: 20,
        color:'black',
        marginVertical:40,
        
        },
        inputPassword:{
            width:300,
            borderBottomColor: 'grey',
            borderBottomWidth: 2,
            fontSize: 20,
            color:'black',
            paddingTop:20,
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



