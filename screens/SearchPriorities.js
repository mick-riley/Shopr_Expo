import React, {Component} from 'react';
import * as firebase from "firebase";
import {db} from '../functions/Fire';
import {View, Text, StyleSheet, TouchableOpacity,Modal, FlatList, SafeAreaView, Button} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

const exampleData = [...Array(20)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index
  }));

export default class SearchPriorities extends Component {
  constructor() {
      super();
      this.user = firebase.auth().currentUser;
      this.state = {
          orderedList: [],
          data: exampleData
      }
  }

  componentDidMount() {
    this.setState({data: this.props.navigation.state.params.list});
  }

  componentWillUnmount() {
  }

  renderItem = ({ item, index, drag, isActive }) => {
      return (
        <TouchableOpacity
          style={{
            height: 75,
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 10
          }}
          onLongPress={drag}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "gray",
              fontSize: 18
            }}
          >
            {item.product} ({item.brand})
          </Text>
        </TouchableOpacity>
      );
    };

  fib = (n) => {
    let memo = {};
    if (n in memo) { 
      return memo[n] 
    }
    else { 
      if (n <= 1) { 
        memo[n] = n 
      } 
      else { 
        memo[n] = this.fib(n - 1) + this.fib(n - 2) 
      } 
      return memo[n]
    }
  }

  fibValue = (items) => {
    let value = items.length;
    items.forEach((item) => {
      this.setState({orderedList: [... this.state.orderedList,
      {
        id: item.id,
        product: item.product,
        brand: item.brand,
        value: this.fib(value)
      }]});
      value--;
    });

    this.props.navigation.navigate('SearchQuantity',
    {
      list: this.state.orderedList
    })
  }

  render() {
      const listItems = [];
      console.log(this.state.data);
      return (
        <View style={styles.container}>
          <View style={{ flex: 3 }}>
            <Text style = {styles.header}>Order the items by priority</Text>
            <DraggableFlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            onDragEnd={({ data }) => this.setState({ data })}
            />
          </View>
          <View style={{flex: 1}}>
          </View>
            <Button 
              title = "Set Priorities"
              onPress = {() => this.fibValue(this.state.data)}
            />
          </View>
      );
  }
}

const styles = StyleSheet.create({
  header: {
    fontWeight: "300",
    fontSize:32,
    color: "black"
  },
  container: {
    flex: 1
  }
});