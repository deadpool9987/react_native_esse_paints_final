import React, { useState, useRef } from "react";

import Carousel from "react-native-snap-carousel";
import {
  Image,
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import Network from "../constants/Network";
import axios from "axios";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as dp,
} from "react-native-responsive-screen";
const { height, width } = Dimensions.get("window");

const HomeSlider = ({ navigation }) => {
  const carouselRef = useRef(null);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0);

  const [carouselItems, setcarouselItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    getSliders();
  }

  async function getSliders() {
    const url = Network.apiurl + "slider";

    const result = await axios
      .get(url, { headers: { Authorization: Network.token } })
      .then(function (response) {
        //console.log(response.data);
        setLoaded(true);
        setcarouselItems(response.data);
        return response.data;
      });
  }

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <TouchableWithoutFeedback
        onPress={() => navigation.navigate('Offer')}
        >
          <Image
            source={{ uri: Network.bannerUrl + item.image }}
            style={{
              width: 330,
              height: 198,
              borderRadius: 4,
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <Carousel
      ref={carouselRef} //nuevo
      //loop={true}
      inactiveSlideOpacity={0.3}
      //inactiveSlideScale={0.5}
      //firstItem={renderFirstItem}
      sliderWidth={width}
      itemWidth={333}
      itemHeight={200}
      data={carouselItems}
      renderItem={renderItem}
      containerCustomStyle={{ overflow: "visible" }}
      contentContainerCustomStyle={{ overflow: "visible" }}
      layout={"default"}
      //nuevo
      //apparitionDelay={2}//estar al loro de esta propiedad
      loopClonesPerSide={5}
      loop={true}
      onSnapToItem={(index) => setSlider1ActiveSlide(index)}
      //enableMomentum={false}
      //lockScrollWhileSnapping={true}
      autoplay={true}
      // autoplayDelay={3000}
      autoplayInterval={5000}
      /*activeAnimationOptions={{
        friction: 8,
        tension: 10
      }}*/
    />
  );
};

export default HomeSlider;
