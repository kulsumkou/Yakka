import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../constants";

interface CustomMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  onPress?: () => void;
}

const CustomMapMarker: React.FC<CustomMarkerProps> = ({
  coordinate,
  imageUrl,
  onPress
}) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <Svg viewBox="0 0 50 70.832" height="70.832" width="50">
        <Path
          id="Path_1147"
          data-name="Path 1147"
          d="M763.477,1491.052a25,25,0,0,0-25,25c0,20.936,25,45.831,25,45.831s25-26.508,25-45.831A25,25,0,0,0,763.477,1491.052Zm0,44.365a18.8,18.8,0,1,1,18.8-18.8A18.805,18.805,0,0,1,763.477,1535.417Z"
          transform="translate(-738.477 -1491.052)"
          fill={colors.greenYakka}
        />
      </Svg>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl}} style={styles.image} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "absolute",
    top: 4,
    left: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.svgUserGrey
  },
});

export default CustomMapMarker;
