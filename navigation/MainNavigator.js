import React, { useState, useEffect } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

//SCREENS
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BalanceScreen from "../screens/BalanceScreen";
import AboutScreen from "../screens/AboutScreen";
import OfferScreen from "../screens/OfferScreen";


const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function MainNavigator({ navigation, route }) {

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Esdee Paints',
      headerLeft: () => (
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 36, height: 36, marginLeft: 10 }}
        />
      ),
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: '#f4511e',
      },
    });
  }, [navigation]);





  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}

      />
      <Tab.Screen
        name="Wallet"
        component={BalanceScreen}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="logo"
        showLabel={false}
        component={AboutScreen}
        options={{
          showLabel: false,
          tabBarLabel: '',
          tabBarIcon: () => {
            return (<Image
              style={{ width: 72, height: 72, marginBottom: 6 }}
              source={require('../assets/icon.png')} />)
          },
        }}
      />
      <Tab.Screen
        name="Offer"
        component={OfferScreen}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color, size }) => (
            <Icon name="magic" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


