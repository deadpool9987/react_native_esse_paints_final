import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from "axios";
import Network from "../constants/Network";
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../utils/AuthContext';

export default function QrScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [points, setPoints] = useState(false);

  const { authState } = useContext(AuthContext);


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();


  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    const url = Network.apiurl + 'reedemcoupon';

    axios.post(url, {
      coupon_code: data,
      user_id: authState.userToken
    }, {
      headers: { 'Authorization': Network.token }
    })
      .then(function (response) {
        //console.log(navigation);
        if (response.data) {
          if (response.data.status == true) {
            setPoints(response.data.points);
          } else {
            ToastAndroid.show(response.data.message, ToastAndroid.LONG);
            navigation.navigate('Home')
          }

        } else {
          alert('AN Error occured, try again')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject, styles.cameraContainer]}
      />}
      {scanned && !points && <ActivityIndicator
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          backgroundColor: "#fff",
        }}
        size="large"
        color="#3492eb"
      />
      }
      {points &&
        <View style={styles.congratsContainer}>

          <Image
            source={require("../assets/logo.png")}
            style={{ width: 300, height: 150, resizeMode: 'contain', alignSelf: 'center' }}
          />

          <Image source={require('../assets/images/congratulations.jpg')} style={styles.img} />
          <Text style={{ fontSize: 40, alignSelf: 'center', color: '#f4511e' }}>You Have Won</Text>

          <View style={styles.box}><Text style={{ fontSize: 40, fontWeight: 'bold', margin: 20, color: '#016117' }}>{points} Points</Text></View>

          <Button
            icon={
              <Icon
                name="money"
                size={25}
                color="white"
              />
            }
            onPress={() => navigation.replace('Balance')}
            title=" Check Balance"
            titleStyle={{ fontSize: 20 }}
            buttonStyle={{ height: 70, borderRadius: 70, marginBottom: 8 }}
            containerStyle={{ backgroundColor: '#ccc', margin: 15 }}
          />

        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  congratsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cameraContainer: {
    marginHorizontal: 0, marginLeft: 0, marginStart: 0,
    paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
    padding: 0
  },
  img: {
    marginVertical: 0,
    marginHorizontal: 10,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  box: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    margin: 20,
    backgroundColor: '#b5ffbb',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#084d3b',
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 3
  }
});