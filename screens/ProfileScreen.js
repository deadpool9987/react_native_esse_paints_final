import React, { useState, useEffect, useContext } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import Network from "../constants/Network";
import {  Button } from "react-native-elements";
import { AuthContext } from '../utils/AuthContext';
import Loading from "../components/Loading";



export default function ProfileScreen({ navigation, route }) {


  const [loaded, setLoaded] = useState(false);
  const [details, setprofileDetails] = useState(false);

  const { authState, signOut } = useContext(AuthContext);



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
    const result = await axios.get(url, { headers: { 'Authorization': Network.token } }).then(function (response) {
      //console.log(response.data)
      if (response.data.status) {
        setprofileDetails(response.data.user_details);
      }
      setLoaded(true);
      return true;
    });
  }

  function senttoEdit() {
    setLoaded(false)
    navigation.navigate('EditProfile')
  }

  if (!loaded) {
    return (
      <Loading/>
    );
  } else {
    return (
    <ScrollView 
    showsVerticalScrollIndicator={false}
     showsHorizontalScrollIndicator={false}
     >
      <View style={styles.container}>
        {loaded &&
          <View style={styles.card}>
            <Text style={styles.heading}>You Profile</Text>
            <View style={styles.list}>
              <Text>Name : {details.name}</Text>
            </View>
            <View style={styles.list}>
              <Text>Dealer Ref : {details.dealer_reference}</Text>
            </View>
            <View style={styles.list}>
              <Text>Phone : {details.mobile_no}</Text>
            </View>
            <View style={styles.list}>
              <Text>Email : {details.email}</Text>
            </View>
            <View style={styles.list}>
              <Text>Address : {details.address}</Text>
            </View>
            <View style={styles.list}>
              <Text>City. : {details.city}</Text>
            </View>
            <View style={styles.list}>
              <Text>State : {details.state}</Text>
            </View>
            <View style={styles.list}>
              <Text>Pincode : {details.pin}</Text>
            </View>
            <View style={styles.list}>
              <Text>Aadhar No. : {details.aadhar_no}</Text>
            </View>
            <View style={styles.list}>
              <Text>Bank Name : {details.bank_name}</Text>
            </View>
            <View style={styles.list}>
              <Text>Bank IFSC : {details.bank_ifsc}</Text>
            </View>
            <View style={styles.list}>
              <Text>Bank Acc No. : {details.bank_account_no}</Text>
            </View>
            <View style={styles.list}>
              <View style={{ flexDirection: "row" }}>
                <Text>KYC Status:</Text>
                {details.is_verify == '1' ? (<Text style={{ color: 'green' }}> Verified </Text>) : (<Text> Not Verified</Text>)}
              </View>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              {parseInt(details.is_verify) !=  1 && <Button
                title="Edit"
                onPress={senttoEdit}
                containerStyle={{ width: 120, margin: 10 }}
                buttonStyle={{ backgroundColor: '#333' }}
              />
            }
              <Button
                title="Logout"
                onPress={signOut}
                containerStyle={{ width: 120, margin: 10 }}

              />
            </View>

          </View>
        }
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
    padding: 20,
    margin: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
  heading: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    color:'#e3e3e3',
    fontSize:35,
    fontWeight:'bold'
  },
  thumb: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    backgroundColor: "#f7f7f7",
    alignSelf: "center",
  },
});
