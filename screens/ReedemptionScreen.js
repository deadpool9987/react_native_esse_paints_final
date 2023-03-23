import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Card, Button } from "react-native-elements";

import Network from "../constants/Network";
import axios from "axios";

import Loading from "../components/Loading";

import { AuthContext } from "../utils/AuthContext";

export default function ReedemptionScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [history, setHistoryData] = useState([]);

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!loaded) {
      getBalance();
    }
  }, [loaded]); //Empty array for deps.

  async function getBalance() {
    const user_id = authState.userToken;
    const url = Network.apiurl + "reedemhistory/" + user_id;
    //console.log(url)
    const result = await axios
      .get(url, { headers: { Authorization: Network.token } })
      .then(function (response) {
        //console.log(response.data);
        setLoaded(true);
        if (response.data.status == true) {
          setHistoryData(response.data.result);
        }
        return true;
      });
  }

  const Item = ({ id, request_amt, payment_status, create_at }) => (
    <View style={styles.item}>
      <Card>
        <Card.Title>
          Requested {request_amt} on {create_at}
        </Card.Title>
        <Card.Divider />
        {payment_status == "pending" ? (
          <Text style={{ alignSelf: "center", color: "red" }}>
            {" "}
            {payment_status}
          </Text>
        ) : (
          <Text style={{ alignSelf: "center", color: "green" }}>
            {" "}
            {payment_status}
          </Text>
        )}
      </Card>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      navigation={navigation}
      id={item.id}
      request_amt={item.request_amt}
      payment_status={item.payment_status}
      create_at={item.create_at}
    />
  );

  if (!loaded) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
