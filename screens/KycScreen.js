import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ProgressBarAndroid,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import Network from "../constants/Network";
import Icon from "react-native-vector-icons/FontAwesome";
import { Divider, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

import { AuthContext } from '../utils/AuthContext';
import Loading from "../components/Loading";



export default function KycScreen({ navigation, route }) {
  const [loaded, setLoaded] = useState(false);
  const [isuploadDisabled, setuploadDisabled] = useState(true);
  const [profileKYCstatus, setprofileKYCstatus] = useState("");
  const [profileKYCRemarks, setprofileKYCRemarks] = useState("");
  const [profileKYCPhoto, setprofileKYCPhoto] = useState("");
  const [profileKYCidProof, setprofileKYCidProof] = useState("");
  const [profileKYCaddressProof, setprofileKYCaddressProof] = useState("");
  const [profileKYCaddressProofBack, setprofileKYCaddressProofBack] = useState("");

  const { authState } = useContext(AuthContext);



  const [photoImage, setphotoImage] = useState("");
  const [photoSelected, setphotoSelected] = useState(false);
  const [panImage, setpanImage] = useState("");
  const [panSelected, setpanSelected] = useState(false);
  const [aadharImage, setaadharImage] = useState("");
  const [aadharSelected, setaadharSelected] = useState(false);
  const [aadharImageBack, setaadharImageBack] = useState("");
  const [aadharBackSelected, setaadharBackSelected] = useState(false);
  const [ProgressBarValue, updateProgressBarValue] = useState(0);
  const [isnotUploading, setisnotUploading] = useState(true);

  const photourl = Network.kycUrl;

  useEffect(() => {
    if (!loaded) {
      getProfile();
    }

    if (photoSelected && panSelected && aadharSelected && aadharBackSelected && isnotUploading) {
      setuploadDisabled(false);
    } else {
      setuploadDisabled(true);
    }

  });
  async function getProfile() {

    const url = Network.apiurl + "kyc/" + authState.userToken;

    const result = await axios.get(url, { headers: { 'Authorization': Network.token } })
      .then(function (response) {
        if (response.data.status) {
          //console.log(response.data);
          setprofileKYCstatus(response.data.kyc_details.kyc_status);
          setprofileKYCRemarks(response.data.kyc_details.kyc_remarks);
          setprofileKYCPhoto(response.data.kyc_details.photo);
          setprofileKYCidProof(response.data.kyc_details.pan);
          setprofileKYCaddressProof(response.data.kyc_details.address_proof);
          setprofileKYCaddressProofBack(response.data.kyc_details.address_proof_back);
        } else {
          setprofileKYCstatus('KYC not Uploaded yet')
        }
        return true;
      })
      .catch((error) => console.log("Error" + error))

    setLoaded(true);
  }

  let uploadData = async () => {

    setisnotUploading(false);
    let formData = new FormData();
    let photolocalUri = photoImage.localUri;
    let panlocalUri = panImage.localUri;
    let aadharlocalUri = aadharImage.localUri;
    let aadharBacklocalUri = aadharImageBack.localUri;

    let photofilename = photolocalUri.split("/").pop();
    let panfilename = panlocalUri.split("/").pop();
    let aadharfilename = aadharlocalUri.split("/").pop();
    let aadharbackfilename = aadharBacklocalUri.split("/").pop();
    // Infer the type of the image
    let photomatch = /\.(\w+)$/.exec(photofilename);
    let panmatch = /\.(\w+)$/.exec(panfilename);
    let aadharmatch = /\.(\w+)$/.exec(aadharfilename);
    let aadharbackmatch = /\.(\w+)$/.exec(aadharbackfilename);

    let phototype = photomatch ? `image/${photomatch[1]}` : `image`;
    let pantype = panmatch ? `image/${panmatch[1]}` : `image`;
    let aadhartype = aadharmatch ? `image/${aadharmatch[1]}` : `image`;
    let aadharbacktype = aadharmatch ? `image/${aadharbackmatch[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    // Assume "photo" is the name of the form field the server expects

    formData.append("code", authState.userToken);
    //sformData.append("type", type);

    formData.append("photo", {
      uri: photolocalUri,
      name: photofilename,
      type: phototype,
    });
    formData.append("pan", {
      uri: panlocalUri,
      name: panfilename,
      type: pantype,
    });
    formData.append("aadhar", {
      uri: aadharlocalUri,
      name: aadharfilename,
      type: aadhartype,
    });
    formData.append("aadharback", {
      uri: aadharBacklocalUri,
      name: aadharbackfilename,
      type: aadharbacktype,
    });

    const url = Network.apiurl + "kycupdate";
    //    const result = await axios.get(url, { headers: { 'Authorization': Network.token } })

    const result = await axios
      .post(url, formData, {
        onUploadProgress: (progressEvent) => {
          const totalLength = progressEvent.lengthComputable
            ? progressEvent.total
            : progressEvent.target.getResponseHeader("content-length") ||
            progressEvent.target.getResponseHeader(
              "x-decompressed-content-length"
            );
          if (totalLength !== null) {
            updateProgressBarValue(
              Math.round((progressEvent.loaded * 100) / totalLength) / 100
            );
          }
        },
        headers: { 'Authorization': Network.token }
      })
      .then(function (response) {
        // handle success
        //console.log(response);

        setphotoImage("");
        setpanImage("");
        setaadharImage("");
        ToastAndroid.show("Upload Successfull", ToastAndroid.LONG);
        setLoaded(false);
        navigation.replace("Kyc");
      })
      .catch((error) => console.log("Error" + error));
  };

  let openPhotoPickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    //console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      setphotoSelected(false);
      return;
    }
    setphotoImage({ localUri: pickerResult.uri });
    setphotoSelected(true);
  };

  let openPanPickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    //console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      setpanSelected(false);
      return;
    }
    setpanImage({ localUri: pickerResult.uri });
    setpanSelected(true);
  };

  let openAadharPickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    //console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      setaadharSelected(false);
      return;
    }
    setaadharImage({ localUri: pickerResult.uri });
    setaadharSelected(true);
  };

  let openAadharBackPickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    //console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      setaadharBackSelected(false);
      return;
    }
    setaadharImageBack({ localUri: pickerResult.uri });
    setaadharBackSelected(true);
  };
  if (!loaded) {
    return (
      <Loading/>
    );
  } else {

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: 'center' , paddingVertical:10}}><Text style={{ fontWeight: 'bold' }}>KYC Status : </Text><Text>{profileKYCstatus}</Text></View>
          <Divider style={{ backgroundColor: "#ccc" }} />
          {profileKYCRemarks != "" && (
            <View style={{ flexDirection: "row", alignItems: 'center' }}><Text style={styles.listText}>Remarks : </Text><Text>{profileKYCRemarks}</Text></View>
          )}
          {profileKYCPhoto != "" && (
            <View style={{ flexDirection: "row", alignItems: 'center', marginVertical:5 }}>
              <Text style={styles.listText}>Photo :</Text>
              <Image
                source={{ uri: photourl + profileKYCPhoto }}
                style={styles.thumbnail}
              />
            </View>
          )}
          {profileKYCidProof != "" && (
            <View style={{ flexDirection: "row", alignItems: 'center', marginVertical:5 }}>
              <Text style={styles.listText}>ID Proof :</Text>
              <Image
                source={{ uri: photourl + profileKYCidProof }}
                style={styles.thumbnail}
              />
            </View>
          )}
          {profileKYCaddressProof != "" && (
            <View style={{ flexDirection: "row", alignItems: 'center', marginVertical:5 }}>
              <Text style={styles.listText}>Address Proof :</Text>
              <Image
                source={{ uri: photourl + profileKYCaddressProof }}
                style={styles.thumbnail}
              />
            </View>
          )}
          {profileKYCaddressProofBack != "" && (
            <View style={{ flexDirection: "row", alignItems: 'center', marginVertical:5 }}>
              <Text style={styles.listText}>Cheque/Passbook Front :</Text>
              <Image
                source={{ uri: photourl + profileKYCaddressProofBack }}
                style={styles.thumbnail}
              />
            </View>
          )}
        </View>

        {profileKYCstatus != 'Approved' &&
          profileKYCstatus != 'Under Review' && (
            <View style={{ padding: 20, backgroundColor: "#fff" }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 6,
                }}
              >
                {photoSelected && (
                  <Image
                    source={{ uri: photoImage.localUri }}
                    style={styles.thumbnail}
                  />
                )}
                {panSelected && (
                  <Image
                    source={{ uri: panImage.localUri }}
                    style={styles.thumbnail}
                  />
                )}
                {aadharSelected && (
                  <Image
                    source={{ uri: aadharImage.localUri }}
                    style={styles.thumbnail}
                  />
                )}
                {aadharBackSelected && (
                  <Image
                    source={{ uri: aadharImageBack.localUri }}
                    style={styles.thumbnail}
                  />
                )}
              </View>
              {isnotUploading == false && (
                <View>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={ProgressBarValue}
                  />
                </View>
              )}
              <Button
                icon={{
                  name: "photo-camera",
                  size: 24,
                  color: "#3492eb",
                }}
                title="Photo"
                type="outline"
                onPress={openPhotoPickerAsync}
                containerStyle={{ marginBottom: 4 }}
              />

              <Button
                icon={{
                  name: "photo-camera",
                  size: 24,
                  color: "#3492eb",
                }}
                title="ID Proof"
                type="outline"
                onPress={openPanPickerAsync}
              />

              <Button
                icon={{
                  name: "photo-camera",
                  size: 24,
                  color: "#3492eb",
                }}
                title="Address Proof"
                type="outline"
                onPress={openAadharPickerAsync}
                containerStyle={{ marginVertical: 4 }}
              />

              <Button
                icon={{
                  name: "photo-camera",
                  size: 24,
                  color: "#3492eb",
                }}
                title="Cheque/Passbook Front"
                type="outline"
                onPress={openAadharBackPickerAsync}
                containerStyle={{ marginVertical: 4 }}
              />

              <Button
                icon={{
                  name: "cloud-upload",
                  size: 24,
                  color: "#fff",
                }}
                title="Upload"
                onPress={uploadData}
                containerStyle={{ marginTop: 10 }}
                disabled={isuploadDisabled}
              />
            </View>
          )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3492eb",
    padding: 6,
    margin: 4,
    borderRadius: 5,
    width: 160,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 150,
    height: 140,
    resizeMode: 'contain',
  },
  listText: {
    paddingVertical: 10,
    width: 150
  },
});