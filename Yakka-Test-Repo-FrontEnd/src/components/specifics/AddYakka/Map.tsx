import {
  ActionSheetProvider,
  useActionSheet
} from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { colors } from "../../../constants";
import useLocation from "../../../hooks/useLocation";

type Location = {
  latitude: number;
  longitude: number;
  name?: string;
};

export default function Map({
  markerPosition,
  onLocationSelected,
  closeMap
}: {
  onLocationSelected: (location: {
    lat: number;
    lng: number;
    name?: string;
  }) => void;
  closeMap: () => void;
  markerPosition? : {
    lat: number | undefined;
    lng: number | undefined;
    name: string | undefined;
  } | undefined;
}) {
  const { showActionSheetWithOptions } = useActionSheet();

  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const { getLocation, isLoading } = useLocation();
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0
  });
  useEffect(() => {
    (async () => {
      
      if(markerPosition?.lat && markerPosition.lng){
        console.log("I AM HERE")
        setSelectedLocation({
          latitude: markerPosition?.lat,
          longitude: markerPosition?.lng,
          name: markerPosition?.name
        })
        setLocation({
          latitude: markerPosition?.lat,
          longitude: markerPosition?.lng,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05
        });
      }else{
        console.log("I AM NOT HERE")
      const currentLocation = await getLocation();
      setLocation({
        latitude: currentLocation?.coords.latitude || 51.509865,
        longitude: currentLocation?.coords.longitude || -0.118092,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05
      });
      }
    })();
  }, [markerPosition?.lat]);

  const showSheet = (location: Location) => {
    const options = ["Use this location", "Cancel"];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        message: location?.name || "Select this location?",
        options,
        cancelButtonIndex
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            onLocationSelected({
              lat: location.latitude,
              lng: location.longitude,
              name: location.name
            });
            break;

          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  return (
    <View className="absolute inset-0 h-screen w-screen">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={30} color={colors.greenYakka} />
        </View>
      ) : (
        <MapView
          onPress={e => {
            setSelectedLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            });
            const { latitude, longitude } = e.nativeEvent.coordinate;
            showSheet({
              latitude,
              longitude
            });
          }}
          onPoiClick={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            const name = e.nativeEvent.name;
           
            setSelectedLocation({
              latitude,
              longitude,
              name
            });

            showSheet({
              latitude,
              longitude,
              name
            });
          }}
          region={location}
          initialRegion={location}
          showsUserLocation={markerPosition?.lat? false : true}
          provider={PROVIDER_GOOGLE}
          className="absolute inset-0 h-screen w-screen"
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Location">
              <Ionicons name="location" size={38} color={colors.greenYakka} />
            </Marker>
          )}
        </MapView>
      )}
    </View>
  );
}
