import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as dp,
} from "react-native-responsive-screen";

import axios from "axios";
import Network from "../constants/Network";

import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import HomeSlider from "../components/HomeSlider";
import Base64 from "Base64";

import { AuthContext } from "../utils/AuthContext";

import Loading from "../components/Loading";


export default function HomeScreen({ navigation, route }) {
  const { authState,signOut } = useContext(AuthContext);

  const [loaded, setLoaded] = useState(false);
  const [details, setprofileDetails] = useState(false);
  const [disable, setDisable] = useState(false);

  /*useEffect(() => {
    if (!loaded) {
      //getProfile();
    }

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }); //Empty array for deps.

*/
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      getProfile();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  async function getProfile() {

  if(!Boolean(authState.userToken)){
    signOut()
  }
    const url = Network.apiurl + "profile/" + authState.userToken;

    const result = await axios
      .get(url, { headers: { Authorization: Network.token } })
      .then(function (response) {
       // console.log(response.data.user_details)
        if (response.data.status) {
          setprofileDetails(response.data.user_details);
          if (
            !response.data.user_details.name ||
            !response.data.user_details.address ||
            !response.data.user_details.state ||
            !response.data.user_details.city ||
            !response.data.user_details.pin ||
            !response.data.user_details.dealer_reference ||
            !response.data.user_details.bank_name ||
            !response.data.user_details.aadhar_no ||
            !response.data.user_details.bank_account_no
          ) {
            ToastAndroid.show("Profile Not Complete", ToastAndroid.SHORT);
            navigation.navigate("Profile");
          }

          if (response.data.user_details.is_verify == "0") {
            setDisable(true);
          }

          if (response.data.user_details.is_active == "0") {
            //setDisable(true);
            signOut()
          }
        }
        setLoaded(true);
        return true;
      })
      .catch((error) => console.error());
  }

  if (!loaded) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        <HomeSlider navigation={navigation} />

        <View style={styles.buttoncontainer}>
          <Button
            icon={<Icon name="qrcode" size={30} color="white" />}
            onPress={() => navigation.navigate("Qr")}
            title=" Scan QR"
            titleStyle={{ fontSize: 20 }}
            buttonStyle={{ height: 70, borderRadius: 70, marginBottom: 8 }}
            containerStyle={{ backgroundColor: "#ccc" }}
            disabled={disable}
          />
          <Button
            icon={<Icon name="money" size={25} color="white" />}
            onPress={() => navigation.navigate("Balance")}
            title=" Check Balance"
            titleStyle={{ fontSize: 20 }}
            buttonStyle={{ height: 70, borderRadius: 70, marginBottom: 8 }}
            containerStyle={{ backgroundColor: "#ccc", marginTop: 10 }}
            disabled={disable}
          />

          <Button
            icon={<Icon name="users" size={25} color="white" />}
            onPress={() => navigation.navigate("Kyc")}
            title=" KYC"
            titleStyle={{ fontSize: 20 }}
            buttonStyle={{ height: 70, borderRadius: 70, marginBottom: 8 }}
            containerStyle={{ backgroundColor: "#ccc", marginTop: 10 }}
          />
          <Button
            icon={<Icon name="check-square-o" size={25} color="white" />}
            onPress={() => navigation.navigate("Reedemption")}
            title=" Reedemtion History"
            titleStyle={{ fontSize: 20 }}
            buttonStyle={{ height: 70, borderRadius: 70, marginBottom: 8 }}
            containerStyle={{ backgroundColor: "#ccc", marginTop: 10 }}
            disabled={disable}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  img: {
    width: dp("100%"),
    height: 200,
    resizeMode: "contain",
  },

  buttoncontainer: {
    marginTop: 20,
    marginHorizontal: 50,
  },
});
