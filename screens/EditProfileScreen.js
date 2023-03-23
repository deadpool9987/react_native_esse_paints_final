import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import axios from "axios";
import Network from "../constants/Network";

import { Card, Button } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "../components/Loading";

import { AuthContext } from "../utils/AuthContext";

export default function ProfileScreen({ navigation, route }) {
  const [loaded, setLoaded] = useState(false);
  const [details, setprofileDetails] = useState(false);
  const [updatedValues, setcupdatedValues] = useState(false);
  const [isloading, setLoadning] = useState(false);

  const { authState } = useContext(AuthContext);

  const [myState, setmyState] = useState(false);

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
    const url = Network.apiurl + "profile/" + authState.userToken;

    //console.log(url);

    const result = await axios
      .get(url, { headers: { Authorization: Network.token } })
      .then(function (response) {
        //console.log(response.data)
        if (response.data.status) {
          setprofileDetails(response.data.user_details);
          setmyState(response.data.user_details);
        }
        setLoaded(true);
        return true;
      })
      .catch((error) => console.error());
  }

  const onChangeText = (key, val) => {
    const newState = details; // clone the array
    //newState.key = val; // set the new value \\
    //setmyState(newState);
    //console.log(key);
    if (key == "phone") {
      val = val.replace(/[^0-9]/g, "");
    }
    newState[key] = val;
    setprofileDetails(newState);
    setcupdatedValues(updatedValues == true ? false : true);
    //console.log(myState);
  };

  const editProfile = async () => {
    //console.log(myState)
    setLoadning(true);

    const {
      id,
      name,
      address,
      aadhar_no,
      city,
      state,
      bank_account_no,
      bank_name,
      bank_ifsc,
      pin,
      email,
      dealer_reference,
    } = myState;

    if (
      !name ||
      !address ||
      !aadhar_no ||
      !city ||
      !state ||
      !bank_account_no ||
      !bank_name ||
      !bank_ifsc ||
      !pin ||
      !dealer_reference
    ) {
      setLoadning(false);
      return alert("(*) fields are required");
    }

    try {
      // here place your signup logic
      // console.log("user successfully signed up!: ", success);

      const url = Network.apiurl + "updateprofile";

      //console.log(url);

      axios
        .post(
          url,
          {
            name: name,
            address: address,
            aadhar_no: aadhar_no,
            city: city,
            state: state,
            bank_account_no: bank_account_no,
            bank_name: bank_name,
            bank_ifsc: bank_ifsc,
            email: email,
            pin: pin,
            dealer_reference: dealer_reference,
            user_id: id,
          },
          {
            headers: { Authorization: Network.token },
          }
        )
        .then(function (response) {
          setLoadning(false);

          // console.log(response.data);

          if (response.data.status === true) {
            navigation.navigate("Profile");
          } else {
            setLoadning(false);
            alert(response.data.message);
          }
        })
        .catch(function (error) {
          setLoadning(false);
          //console.log(error);
        });
    } catch (err) {
      console.log("error signing up: ", err);
    }
  };

  if (!loaded) {
    return <Loading />;
  } else {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {loaded && (
            <View style={styles.card}>
              <View style={styles.labelcontainer}>
                <Text style={styles.label}> Name* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  onChangeText={(val) => onChangeText("name", val)}
                  value={details.name}
                />
              </View>
              <View style={styles.labelcontainer}>
                <Text style={styles.label}> Dealer Ref* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Dealer Reference"
                  onChangeText={(val) => onChangeText("dealer_reference", val)}
                  value={details.dealer_reference}
                />
              </View>

              <View style={styles.list}>
                <Text style={styles.label}>Email :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Email"
                  keyboardType="email-address"
                  onChangeText={(val) => onChangeText("email", val)}
                  value={details.email}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>Address* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Address"
                  onChangeText={(val) => onChangeText("address", val)}
                  value={details.address}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>City* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your City"
                  onChangeText={(val) => onChangeText("city", val)}
                  value={details.city}
                />
              </View>

              <View style={styles.list}>
                <Text style={styles.label}>State* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your State"
                  onChangeText={(val) => onChangeText("state", val)}
                  value={details.state}
                />
              </View>

              <View style={styles.list}>
                <Text style={styles.label}>Pincode* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Pincode"
                  onChangeText={(val) => onChangeText("pin", val)}
                  value={details.pin}
                  maxLength={10}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>Aadhar No.* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Aadhar no"
                  onChangeText={(val) => onChangeText("aadhar_no", val)}
                  value={details.aadhar_no}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>Bank Name* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Bank Name"
                  onChangeText={(val) => onChangeText("bank_name", val)}
                  value={details.bank_name}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>Bank IFSC* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Bank IFSC Code"
                  onChangeText={(val) => onChangeText("bank_ifsc", val)}
                  value={details.bank_ifsc}
                />
              </View>
              <View style={styles.list}>
                <Text style={styles.label}>Bank Acc No.* :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Bank Account Number"
                  onChangeText={(val) => onChangeText("bank_account_no", val)}
                  value={details.bank_account_no}
                />
              </View>

              <View>
                <Button
                  title="Save Profile"
                  containerStyle={{
                    width: 250,
                    margin: 10,
                    alignSelf: "center",
                    marginVertical: 30,
                  }}
                  buttonStyle={{ backgroundColor: "#333" }}
                  onPress={editProfile}
                  loading={isloading}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#f7f7f7",
  },
  card: {
    padding: 2,
    margin: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  list: {
    flexDirection: "row",
    height: 40,
    paddingVertical: 10,
    justifyContent: "center",
  },
  thumb: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    backgroundColor: "#f7f7f7",
    alignSelf: "center",
  },
  input: {
    width: 250,
    alignSelf: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    height: 40,
    paddingVertical: 10,
    justifyContent: "center",
  },
  input2: {
    width: 220,
    alignSelf: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    height: 60,
  },
  labelcontainer: {
    flexDirection: "row",
    alignContent: "center",
  },
  label: {
    width: 100,
    height: 40,
    textAlignVertical: "center",
  },
  icon: {
    marginTop: 20,
    height: 40,
  },
});