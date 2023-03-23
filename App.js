import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState, useRef, useMemo, useReducer } from "react";
import { StyleSheet, View, ToastAndroid } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import useCachedResources from "./hooks/useCachedResources";

import { AuthContext } from "./utils/AuthContext";
import { reducer, initialState } from "./utils/reducer";

import axios from "axios";
import Network from "./constants/Network";

import MainNavigator from "./navigation/MainNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import QrScreen from "./screens/QrScreen";
import BalanceScreen from "./screens/BalanceScreen";
import KycScreen from "./screens/KycScreen";
import ReedemptionScreen from "./screens/ReedemptionScreen";
import EditProfileScreen from "./screens/EditProfileScreen";

import * as SecureStore from "expo-secure-store";

import LinkingConfiguration from "./navigation/LinkingConfiguration";
const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    //console.log(state);
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("user_id");
        //console.log(userToken);
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const authContextValue = useMemo(
    () => ({
      authState: state,
      signIn: async (user_id) => {
        const store_login_id = await SecureStore.setItemAsync(
          "user_id",
          user_id
        );
        dispatch({ type: "SIGN_IN", token: user_id });
      },
      signOut: async () => {
        const logout = await SecureStore.deleteItemAsync("user_id");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async () => {
        //dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer linking={LinkingConfiguration}>
        {state.userToken != null ? (
          <Stack.Navigator>
            <Stack.Screen name="Root" component={MainNavigator} />
            <Stack.Screen
              name="Qr"
              options={{ headerTitle: "Scan QR Code" }}
              component={QrScreen}
            />
            <Stack.Screen
              name="Balance"
              options={{ headerTitle: "Your Points Balance" }}
              component={BalanceScreen}
            />
            <Stack.Screen
              name="Kyc"
              options={{ headerTitle: "Your KYC" }}
              component={KycScreen}
            />
            <Stack.Screen
              name="Reedemption"
              options={{ headerTitle: "Reedemption History" }}
              component={ReedemptionScreen}
            />
            <Stack.Screen
              name="EditProfile"
              options={{ headerTitle: "Edit Profile" }}
              component={EditProfileScreen}
            />
          </Stack.Navigator>
        ) : (  
          <Stack.Navigator>
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

async function updateToken(token) {
  const url = Network.apiurl + "updatetoken/";

  const result = await axios
    .post(
      url,
      {
        token: token,
      },
      { headers: { Authorization: Network.token } }
    )
    .then(function (response) {
      //console.log(response.data);
    })
    .catch((error) => console.error());
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
    const set_token = await SecureStore.setItemAsync("token", token);
    //console.log(token)
    updateToken(token);
  } else {
    //alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
