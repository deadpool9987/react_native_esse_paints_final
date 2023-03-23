import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableWithoutFeedback
} from "react-native";

import Network from "../constants/Network";
import axios from "axios";

import { AuthContext } from '../utils/AuthContext';



export default function LoginScreen({ navigation, route }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);


  const onChangeText = (val) => {
    //newState.key = val; // set the new value \\
    //setmyState(newState);
    //console.log(key);
    val = val.replace(/[^0-9]/g, "");
    setCode(val);
    //console.log(myState);
  };



  function validate() {
    let valid = true;

    if (code.length == 0) {

      Alert.alert('Error', 'Please Enter Code')
      return false
    }

    if (password.length == 0) {
      Alert.alert('Error', 'Please Enter Password')
      return false
    }

    return valid;
  }

  function submitFrom() {

    if (validate()) {

      //signIn(code,password)
      const url = Network.apiurl + 'login/';
      axios.post(url, {
        mobile_no: code,
        password: password
      }, { headers: { 'Authorization': Network.token } })
        .then(function (response) {

          //console.log(response.data);

          if (response.data.status === true) {

            try {

              signIn(response.data.details.id)
            }
            catch (rejectedValue) {
              // …
              console.log('SET ERROR')
            }




          } else {
            alert(response.data.message)
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    //alert(valid)
  }



  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 300, height: 154, resizeMode: 'contain', marginBottom: 20 }}
      />
      <View>
        <View>
          <TextInput
            onChangeText={(code) => onChangeText(code)}
            placeholder="10 Digit Mobile no"
            style={styles.inputStyle}
            value={code}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          style={styles.inputStyle}
          onChangeText={(password) => setPassword(password)}
          value={password}
        />
        <View style={styles.submitButton}>
          <Button onPress={submitFrom} title="Login" color="#0398fc" />
        </View>
        <View style={styles.submitButton}>
          <Button title="Register" color="#f4511e" onPress={() => navigation.navigate('Register')} />
        </View>

        <View style={styles.forgotButton}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Forgot')} >
            <Text style={{alignSelf:'flex-end'}}>Forgot Password?</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },

  formLabel: {
    fontSize: 20,
    color: "#fff",
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#f7f7f7",
  },
  inputError: {
    color: "red",
    paddingLeft: 10,
  },
  submitButton: {
    marginTop: 20,
  },
  forgotButton: {
    marginTop: 20,
  },
  formText: {
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
