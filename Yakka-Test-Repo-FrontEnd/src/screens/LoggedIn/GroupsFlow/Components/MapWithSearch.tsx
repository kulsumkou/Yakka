import React, { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, View } from "react-native";
import Map from "../../../../components/specifics/AddYakka/Map";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../constants";
import PlacesAutoComplete from "../../../../components/specifics/AddYakka/PlacesAutoComplete";
import { StyleSheet } from "react-native";

const MapWithSearch = ({
  isVisible,
  SetIsVisible,
  selectedLocation,
  setSelectedLocation,
  checkErrors
}: {
  isVisible: boolean;
  SetIsVisible: Dispatch<SetStateAction<boolean>>;
  selectedLocation?: {
    lat: number;
    lng: number;
    name?: string;
    selectedWith: "map" | "search";
  } | null;
  setSelectedLocation: (
    location: {
      lat: number;
      lng: number;
      name: string;
      selectedWith: "map" | "search";
    } | null
  ) => void;
  checkErrors: () => void;
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        visible={isVisible}
        onRequestClose={() => SetIsVisible(!isVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Map
              markerPosition={{
                lat: selectedLocation?.lat,
                lng: selectedLocation?.lng,
                name: selectedLocation?.name
              }}
              closeMap={() => {}}
              onLocationSelected={location => {
                checkErrors();
                //   setCheckErrors({ ...checkErrors, location: undefined });
                setSelectedLocation({
                  lat: location?.lat,
                  lng: location?.lng,
                  name: location?.name ? location?.name : "Unnamed Location",
                  selectedWith: "map"
                });
                SetIsVisible(!isVisible);
              }}
            />
            <View className="flex-row-reverse mt-10 justify-between p-3">
              <Pressable
                style={styles.greyCircle}
                onPress={() => SetIsVisible(!isVisible)}
              >
                <Ionicons
                  size={22}
                  name="checkmark"
                  style={{ fontWeight: "bold" }}
                  color={colors.background}
                />
              </Pressable>
              <View style={{ width: "80%" }}>
                <PlacesAutoComplete
                  disableAutocomplete={selectedLocation?.selectedWith === "map"}
                  setValue={(value: string) => {
                    if (!selectedLocation) return;

                    setSelectedLocation(
                      value.length > 0
                        ? {
                            ...selectedLocation,
                            name: value
                          }
                        : null
                    );
                  }}
                  value={
                    selectedLocation?.name
                      ? selectedLocation?.name
                      : "Unknown Location"
                  }
                  onLocationChange={location => {
                    checkErrors();
                    //   setCheckErrors({
                    //     ...checkErrors,
                    //     location: undefined
                    //   });
                    setSelectedLocation({
                      lat: location?.lat,
                      lng: location?.lng,
                      name: location?.name
                        ? location?.name
                        : "Unnamed Location",
                      selectedWith: "search"
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MapWithSearch;

const styles = StyleSheet.create({
  greyCircle: {
    backgroundColor: colors.greyText,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },
  centeredView: {
    flex: 1,
    marginTop: 2
  },
  modalView: {
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    margin: 2,
    backgroundColor: "white",
    borderRadius: 2,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  container: {
    flex: 1
  }
});
