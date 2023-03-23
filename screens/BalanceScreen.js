import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import Network from "../constants/Network";
import axios from "axios";
import { Card, Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../components/Loading";

import { AuthContext } from "../utils/AuthContext";

export default function BalanceScreen({ navigation, route }) {
  const [balance, setBalance] = useState("...");
  const [loaded, setLoaded] = useState(false);
  const [history, setHistoryData] = useState([]);
  const [reedem_amount, setAmount] = useState("");
  const [visible, setVisible] = useState(false);
  const [min, setMin] = useState(0);
  const [reedebtndisable, setReedebtndisable] = useState(false);
  

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!loaded) {
      getBalance();
    }
  }, [loaded]); //Empty array for deps.

  const Item = ({ id, point_value, coupon_id, coupon_code, create_at }) => (
    <View style={styles.item}>
      <Card>
        <Card.Title>{point_value}</Card.Title>
        <Card.Divider />
        <Text style={{ alignSelf: "center" }}>{create_at}</Text>
      </Card>
    </View>
  );

  const onChangeText = (val) => {
    //newState.key = val; // set the new value \\
    //setmyState(newState);
    //console.log(key);
    val = val.replace(/[^0-9]/g, "");
    setAmount(val);
    //console.log(myState);
  };

  function setreedem() {
    
    Alert.alert(
      "Confirm",
      "Are you sure you want to redeem?",
      [
        {
          text: "Yes",
          onPress: () => {
            setReedebtndisable(true)
            submitFrom()
          },
        },
        {
          text: "No",
          onPress: () => {
            setReedebtndisable(false)
          },
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  function submitFrom() {
    if (!reedem_amount) {
      Alert.alert("Error", "No Amount Selected ");
      setReedebtndisable(false)
      return false;
    }

    if (parseInt(reedem_amount) < parseInt(min)) {
      Alert.alert("Error", "Min amount to reedem is " + min);
      setReedebtndisable(false)
      return false;
    }

    //signIn(code,password)
    const url = Network.apiurl + "redeemed_request/";
    axios
      .post(
        url,
        {
          user_id: authState.userToken,
          request_amt: reedem_amount,
        },
        { headers: { Authorization: Network.token } }
      )
      .then(function (response) {
        //console.log(response.data);

        if (response.data.status == true) {
          navigation.navigate("Balance");
          setLoaded(false);
          setVisible(false);
          setReedebtndisable(false)
        } else {
          alert(response.data.message);
          setReedebtndisable(false)
        }
      })
      .catch(function (error) {
        //console.log(error);
        setReedebtndisable(false)
      });

    //alert(valid)
  }

  async function getBalance() {
    const user_id = authState.userToken;
    const url = Network.apiurl + "checkbalance/" + user_id;
    //console.log(url)
    const result = await axios
      .get(url, { headers: { Authorization: Network.token } })
      .then(function (response) {
        //console.log(response.data);
        setLoaded(true);
        if (response.data.status == true) {
          setBalance(response.data.balance ? response.data.balance : 0);
          setMin(response.data.min ? response.data.min : 0);
          //console.log(response.data.min);
          setHistoryData(response.data.history);
        }
        return true;
      })
      .catch((error) => console.error());
  }

  const renderItem = ({ item }) => (
    <Item
      navigation={navigation}
      id={item.id}
      point_value={item.point_value}
      coupon_id={item.coupon_id}
      coupon_code={item.coupon_code}
      create_at={item.create_at}
    />
  );

  const toggleOverlay = () => {
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {!loaded ? (
        <Loading />
      ) : (
        <>
          <Card
            containerStyle={{
              padding: 0,
              alignItems: "center",
              backgroundColor: "#a44dfa",
            }}
          >
            <Card.Title
              style={{
                padding: 10,
                fontSize: 15,
                color: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#fff",
              }}
            >
              POINT BALANCE
            </Card.Title>
            <Text
              style={{
                padding: 10,
                fontSize: 30,
                color: "#fff",
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              {balance}
            </Text>
            <Button
              onPress={() => {
                setVisible(true);
              }}
              title=" Reedem"
              titleStyle={{ fontSize: 10, color: "#333" }}
              buttonStyle={{
                height: 30,
                width: 150,
                borderRadius: 10,
                marginBottom: 20,
                backgroundColor: "#fff",
                alignSelf: "center",
              }}
            />
          </Card>

          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />

          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            overlayStyle={{ width: 300, height: 150, justifyContent: "center" }}
          >
            <>
              <View style={styles.labelcontainer}>
                <Text style={styles.label}>Reference</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Points to Reedem"
                  onChangeText={(val) => onChangeText(val)}
                  keyboardType={"numeric"}
                  value={reedem_amount}
                />
              </View>

              <View style={styles.labelcontainer}>
                <Button onPress={setreedem} title="Reedem" disabled={reedebtndisable} />
              </View>
            </>
          </Overlay>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 30,
    flex: 1,
  },
  inputStyle: {
    marginVertical: 20,

    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#f7f7f7",
  },
});