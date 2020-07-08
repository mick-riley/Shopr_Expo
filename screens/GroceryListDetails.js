import React, { Component } from "react";
import {View, Text, StyleSheet,SafeAreaView,TouchableOpacity,FlatList,KeyboardAvoidingView,TextInput,Keyboard} from "react-native";
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as firebase from "firebase";
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import {db} from '../functions/Fire';
import shortid from "shortid";
import {Autocomplete, withKeyboardAwareScrollView} from "react-native-dropdown-autocomplete";

Icon.loadFont();

export default class GroceryListDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <TouchableOpacity onPress= {() => {
                    navigation.navigate('Search',
                    {
                        list: navigation.state.params.list.todos,
                        budget: navigation.state.params.list.budget
                    }
                    )}
                } >
                    <Ionicons name='md-search' style={styles.iconStyle}/>
                </TouchableOpacity>
            )
        }
    }

    constructor(){
        super();
        this.user = firebase.auth().currentUser;
        this.state = {
            items: [],
            autoCompleteItems: [],
            list: {}
        };
    }

    /*
    toggleTodoCompleted = index => {
        let list = this.props.checklist
        list.todos[index].completed = !list.todos[index].completed;

        this.props.updateList(list);
    };
    */

    addTodos = ()=> {
        this.state.items.forEach(item => {
            db.collection("users")
            .doc(this.user.uid)
            .collection("lists")
            .doc(this.props.navigation.state.params.list.id.toString())
            .update({
                todos: firebase.firestore.
                    FieldValue.arrayUnion({
                        product: item.product, 
                        brand: item.brand,
                        id: shortid.generate()
                        })
            }).then(result => {
                console.log(result);
                return ;
            }).catch(error => {
                console.error(error);
                return ;
            });
        })
    }



    renderTodo = (todo, index)=> {
        return (
            <View style= {styles.groceryContainer}>
                <TouchableOpacity onPress={()=> this.toggleTodoCompleted(index)}>
                    <Icon 
                    name ={todo.completed ? "ios-square" : "ios-square-outline"}
                     size={24} 
                     color = "#808080" 
                     style={{width:32}}
                     />
                </TouchableOpacity>

                <Text style ={[styles.items,
                {textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.completed ? "grey" :"black" }
                ]}  >
                {todo.title} </Text>
            </View>
        );
    };

    renderListItems = (item, index) => {
        return (
            <View>
                <Text> {item.product} ({item.brand})</Text>
            </View>
        )
    }

    renderNewItems = (item, index) => {
        return (
            <View>
                <Text> {item.product} ({item.brand})</Text>
            </View>
        )
    }

    componentDidMount(){
        this.setState({autoCompleteItems: this.props.navigation.state.params.items});
        this.setState({list: this.props.navigation.state.params.list});
    }

    componentWillUnmount(){
    }
    
    render () {
        const list = this.props.navigation.state.params.list;
        const newItems = [];
        const itemCount = list.todos.length;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        console.log(this.state.list)
        return (
            <SafeAreaView style = {styles.container}>
                <View style={[styles.section, styles.header]}>
                    <View>
                        <Text style ={styles.title}> {list.name} </Text>
                        <FlatList 
                            data = {list.todos}
                            keyExtractor = {item => item.id}
                            showsVerticalScrollIndicator = {false}
                            renderItem = {({item,index}) => this.renderListItems(item,index)}
                        />
                    </View>
                </View>

                <View style = {[styles.section, {flex: 3}]}>
                    <SearchableDropdown 

                        onItemSelect={(item) => {
                            let adder = item.name.split("|");
                            const product = adder[0].trim();
                            const brand = adder[1].trim(); 
                            this.setState({items: [... this.state.items, {product, brand}]});
                            }}
                        containerStyle={{ padding: 5 }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                            }}
                        itemTextStyle={{ color: 'black' }}
                        itemsContainerStyle={{ maxHeight: 200}}
                        items={this.state.autoCompleteItems}
                        resetValue={true}
                        textInputProps={
                        {
                            placeholder: "Rice",
                            underlineColorAndroid: "transparent",
                            style: {
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                                color: "#000"
                            },
                        }
                        }
                        listProps={
                        {
                            nestedScrollEnabled: true,
                        }
                        }
                    />
                </View>

                <View style ={[styles.section, {flex: 1}]} >

                
                <Text> Items </Text>
                <FlatList
                    data = {this.state.items}
                    renderItem = {({item, index}) => this.renderNewItems(item, index)}
                    keyExtractor = {item => item.id}
                    showsVerticalScrollIndicator={false}
               />

                <TouchableOpacity style={styles.addGrocery} onPress={() => this.addTodos()}>
                    <Text style={styles.addButton}>Add Items</Text>
                </TouchableOpacity>

            
                </View>
            </SafeAreaView>
        );

    }
}

const styles = StyleSheet.create ({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems:"center"
    },
    section: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: "flex-start"
    },
    header:{
        justifyContent: "flex-start",
        marginLeft:64,
        borderBottomWidth:3,
        borderBottomColor:'#CC2D6F'
    },
    title: {
        fontSize:28,
        fontWeight:'700',
    },
    itemCount:{
        marginTop: 4,
        marginBottom: 16,
        color: "grey",
        fontWeight:"600"
    },
     footer: {
         paddingHorizontal: 32,
         flexDirection: "row",
         alignItems: "center"
    },
     input: {
        flex:1,
        maxHeight:32,
        alignContent: "flex-start",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
        borderColor: "#CC2D6F"
    },
     inputComplete: {
        maxHeight: 40
    },
     addGrocery : {
         borderRadius: 4,
         padding:16,
         //alignItems: "center",
         justifyContent: "flex-end",
         backgroundColor: "#CC2D6F"
    },
     dropdown: {
         borderRadius: 3,
         alignContent: "flex-start",
         justifyContent: "flex-start"
    },
     addButton :{
         fontWeight:"700",
         color: "white"
    },
     groceryContainer: {
         paddingVertical: 16,
         flexDirection:"row",
         alignItems: "center"
    },
     close: {
        fontSize: 18,
        fontWeight: "700"
    },
    items: {
        color:'black',
        fontWeight:'600'
    },
    iconStyle: {
        fontSize: 40,
        alignSelf: 'center',
        marginHorizontal: 10
    }
    
});