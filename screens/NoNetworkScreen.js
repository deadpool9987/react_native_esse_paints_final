import React from 'react'
import { View, Text, Button, Image } from 'react-native'
import * as Networks from 'expo-network';

export default function NoNetworkScreen({ navigation, route }) {

  const networkstate = async () => {
    try {
      const nstate = await Networks.getNetworkStateAsync();
      if (nstate.isConnected && nstate.isInternetReachable) {
        navigation.goBack()
      }
    } catch (e) {
      console.log("Error fetchiong network state");
    }
  }



  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Image
        source={require("../assets/logo.png")}
        style={{ resizeMode: 'contain', width: 250, height: 66 }}
      />
      <Text style={{ marginTop: 10 }}>Could't connect to server!</Text>
      <Text style={{ marginBottom: 10 }}>Please check internet connection</Text>
      <Button title="Try Again"

        onPress={() =>
          networkstate()
        }

      ></Button>
    </View>
  )
}