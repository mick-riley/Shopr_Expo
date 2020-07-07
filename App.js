import React, {Component} from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from "react-navigation-tabs";
import Loading from './screens/Loading';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Icon from 'react-native-vector-icons/Ionicons';
import GroceryListDetails from './screens/GroceryListDetails';
import Search from './screens/Search';
import QuickSearch from './screens/QuickSearch';
import QuickSearchResults from './screens/QuickSearchResults';
import SupermarketMap from './screens/SupermarketMap';

Icon.loadFont();


import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import {db} from './functions/Fire';

const ListNavigator = createStackNavigator({
  Home: Home,
  GroceryList: GroceryListDetails,
  Search: Search
},{
  initialRouteName: "Home"
})

const ProfileNavigator = createStackNavigator({
  Profile: Profile
}
)

const QuickSearchNavigator = createStackNavigator({
  QuickSearch: QuickSearch,
  QuickSearchResults: QuickSearchResults,
  Map: SupermarketMap
},{
  initialRouteName: "QuickSearch"
})

const MapNavigator = createStackNavigator({
  Map: SupermarketMap
},{
  initialRouteName: "Map"
})

const AppTabNavigator = createBottomTabNavigator ({
  Home: ListNavigator,
  Profile: ProfileNavigator,
  QuickSearch: QuickSearchNavigator
},
{
  initialRouteName: "Home",
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      let routeIconMapping = {
        "Home": "ios-home",
        "Profile": "ios-person",
        "QuickSearch": "md-search"
      }
      iconName = (routeName && routeIconMapping[routeName]) ? routeIconMapping[routeName]: "Home";
      return <Icon name={iconName} size={24} color={tintColor} />;
    }
  }),
  tabBarOptions: {
    activeTintColor: "tomato",
    inactiveTintColor: "gray"
  }
}
);



const AuthStack = createStackNavigator({
  Login: Login,
  Register : Register
})

export default createAppContainer (
  createSwitchNavigator(
    {
    Loading: Loading,
    App: AppTabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Loading"
  }
  )
);


