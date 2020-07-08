import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,Modal} from 'react-native';
import {Header} from 'native-base';
import * as firebase from "firebase";
import AddListModal from "../components/AddListModal";
import { FlatList } from 'react-native-gesture-handler';
import GroceryList from "../components/GroceryList";
import Icon from 'react-native-vector-icons/Ionicons';
import {db} from '../functions/Fire';

Icon.loadFont();

export default class Home extends Component {
    constructor() {
    super();
    this.user = firebase.auth().currentUser;
    this.itemsRef = db.collection("items");
    this.listsRef = db.collection('users').doc(this.user.uid).collection("lists");
    this.state = {
        email: "",
        displayName:"",
        addTodoVisible:false,
        listCount: 0,
        lists: [],
        uniqueItems: []
        };
    }

    toggleAddTodoModal() {
        this.setState({addTodoVisible: !this.state.addTodoVisible})
    }

    renderList = list => {
        return (
        <View>
            <TouchableOpacity style = {styles.listContainer} onPress= {() => {
                this.props.navigation.navigate('GroceryList',
                    {
                        list: list,
                        items: this.state.uniqueItems.slice(0,49),
                        updateList: this.updateList,
                        user: this.user
                    })
                }
            }>
            <GroceryList props = {this.props} list = {list}/>
            </TouchableOpacity>
        </View>
        );
    }

    addList = list => {
        list.budget = parseFloat(list.budget);
        let listCount = this.state.listCount+1;
        const newListCount = listCount.toString();
        db.collection("users")
        .doc(this.user.uid)
        .collection("lists")
        .doc(`${newListCount}`)
        .set({
            id: newListCount,
            name: list.listName,
            budget: list.budget,
            todos: []
        }).then(() => {this.setState({listCount: listCount})
        }).catch(err => console.error(err));
    }

    updateList = list => {
        this.setState({
            lists: this.state.lists.map(item => {
                return item.id ===list.id ? list : item;
            })
        });
    };

    addRow= () =>{
        alert("clicked");
    }

    getUniqueItems = (querySnapshot) => {
        let items = [];
        let counter = 0;
        querySnapshot.forEach((res) => {
            let label = res.data().product + " | " + res.data().brand;
            if (!items.includes(label)){
                items.push({id: counter, name: label});
                counter += 1;
            }
        });
        this.setState({uniqueItems: items});
    }

    getLists = (querySnapshot) => {
        const lists = [];
        let listCount = 0;
        querySnapshot.forEach((res) => {
            if (typeof res.data().count == "undefined"){
                lists.push(res.data());
            } else {
                listCount = res.data().count;
            }
        });
        this.setState({lists});
        this.setState({listCount});
    }

    componentDidMount(){
        //const {email} = user.email;
        this.setState({displayName: this.user.displayName});
        this.getListItems = this.itemsRef.onSnapshot(this.getUniqueItems);
        this.unsubscribe = this.listsRef.onSnapshot(this.getLists);
    }   

    componentWillUnmount(){
        this.unsubscribe();
        this.getListItems();
    }

    

    render() {
        return(
            <View style = {styles.container}>

                <Modal 
                    animationType = "slide" 
                    visible ={this.state.addTodoVisible} 
                    onRequestClose = {() => this.toggleAddTodoModal()}>
                    <AddListModal user = {this.user} listCount = {this.state.listCount} closeModal={() => this.toggleAddTodoModal()} addList= {this.addList}/>
                </Modal>

                <Text style= {styles.greeting }> Hi {this.state.displayName} !</Text>
                
                <View style = {styles.header}>
                    <Text style = {styles.shoppingList}>  Shopping Lists</Text>
                </View>

                <TouchableOpacity style={styles.add} onPress= {() => this.toggleAddTodoModal()}>
                    <Text style={styles.addText}>+</Text>
                </TouchableOpacity>

                
                <View >
                    <Text></Text>
                    <FlatList 
                    data = {this.state.lists} 
                    keyExtractor ={item => item.name}
                    renderItem={({item}) => this.renderList(item)}
                    />
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
        marginTop: 50,
        fontSize: 28,
        fontWeight: '600',
        paddingBottom:10
    },
    shoppingList: {
        paddingTop: 10,
        fontSize: 28,
        fontWeight:"600",
        justifyContent: 'center',
        alignItems:"center"
    },
    header: {
        borderBottomWidth:18,
        width:440,
        justifyContent: 'center',
        alignItems:"center",
        borderBottomColor:'#149F98'       
    
    },
    add: {
        position:'absolute',
        width:50,
        height:50,
        backgroundColor: 'blue',
        borderRadius:30,
        bottom:10,
        right:20,
        alignItems:'center',
        justifyContent: 'center'
        
    },
    addText: {
        color:'white',
        fontSize:30,
        fontWeight:'700'
    },
    listContainer:{
        padding:10,
        marginTop:16,
        borderColor: "#149F98",
        borderWidth: 1,
        borderStyle:"dashed",
        borderRadius:10,
        width:300,
        justifyContent:"center",
        alignItems:'center'
    },


});