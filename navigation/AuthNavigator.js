import React, { useState, useEffect } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


//SCREENS
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotScreen from "../screens/ForgotScreen";


const Stack = createStackNavigator();

const INITIAL_ROUTE_NAME = "Login";

export default function MainNavigator({ navigation, route }) {

  return (
    <Stack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        options={{ headerShown: false }}
        component={RegisterScreen}
      />
      <Stack.Screen
        name="Forgot"
        options={{ headerShown: false }}
        component={ForgotScreen}
      />
    </Stack.Navigator>
  );
}

