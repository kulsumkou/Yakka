
  import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
  import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
  import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
  import { colors } from "../../../constants";
  import useLocation from "../../../hooks/useLocation";
  import CustomMapMarker from "../CustomMapMarker";
  import Modal from "@euanmorgan/react-native-modal";
  import { headerHeightAtom } from "../../../recoil/headerHeightAtom";
import { useRecoilValue } from "recoil";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import {  QueryKeys } from "../../../constants/queryKeys";
import { goFetchLite } from "../../../utils/goFetchLite";
import Toast from "react-native-toast-message";
import { publicGroupSchema } from "../../../models";
import { useNavigation } from "@react-navigation/native";
import { GroupType } from "../../../types/types";
  
 const FindGroupOnMap = ({
    isVisible,
    setIsVisible,
    fetch = true,
    group,

 }:{
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    fetch?: boolean
    group?: GroupType

 }) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigator = useNavigation();
  const { getLocation  } = useLocation();
    const headerHeight = useRecoilValue(headerHeightAtom);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      });
      const [markerData, setMarkerData] = useState<{
        id: number,
        coordinates: {
          longitude: number,
          latitude: number,
        },
        profileImage: string,
        name: string
      }[] | null> ([])



     const publicGroups = useQuery<publicGroupSchema>(
        QueryKeys.PUBLIC_GROUPS,
        () =>
          goFetchLite("groups/publicGroups", {
            method: "GET"
          }),
        {
          onSuccess: (data: any) => {
            setMarkerData(data);
          },
          onError: (error: any) => {
            Toast.show({
              text1: `Something Went Wrong Try Again`,
              type: "error"
            });
          }
        }
      );

      const onPressMarker = (groupId: number) =>{

        setIsVisible(false);
        // @ts-expect-error
        navigator.navigate("ViewGroup", {
          id: groupId
        });
      }

    useEffect(()=>{
      if(fetch){

        (async()=>{
          publicGroups.refetch();
          const currentLocation = await getLocation();
          setLocation({
            latitude: currentLocation?.coords.latitude || 51.509865,
            longitude: currentLocation?.coords.longitude || -0.118092,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05
          });
          setIsLoading(publicGroups.isLoading)
        })()
      }else if(!fetch && group){
        setLocation({
          latitude: group?.coordinates?.latitude  || 51.509865,
          longitude: group?.coordinates?.longitude  || -0.118092,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05
        })
        setMarkerData([{
          id: group?.id,
          coordinates: {
            longitude: group?.coordinates?.longitude || -0.118092,
            latitude: group?.coordinates?.latitude || 51.509865
          },
          profileImage: group?.profileImage || "",
          name: group.name || "no name"
          
        }])
        setIsLoading(false)

      }else{
        setMarkerData([]);
      }
    },[isVisible])
  
    return (
        <Modal
            animationIn={"slideInRight"}
            animationOut="slideOutRight"
            onBackdropPress={
                isVisible ? () => setIsVisible(false) : undefined
            }
            backdropOpacity={0}
            isVisible={isVisible}
            style={{
                margin: 0
            }}
            >

        <View
          style={{ top: headerHeight }}
          className="bg-white pb-2 w-full absolute self-end shadow-lg h-[100%]"
        >
        {isLoading && markerData ? (
            <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} color={colors.greenYakka} />
          </View>
        ) : (
            <>
            <MapView
            className="absolute inset-0 h-screen w-screen"
            provider={PROVIDER_GOOGLE}
            initialRegion={location}
            region={location}
            showsUserLocation={fetch}
            >
            {markerData?.map((marker) => (
                <CustomMapMarker 
                  key={marker.id} 
                  coordinate={marker.coordinates} 
                  imageUrl={marker.profileImage} 
                  onPress={()=> onPressMarker(marker.id)} />
                ))}
          </MapView>
          <View className="flex-row-reverse mt-2 justify-between p-2">
                    <Pressable
                      style={styles.greyCircle}
                      onPress={() => setIsVisible(!isVisible)}
                    >
                      <Ionicons
                        size={22}
                        name="close"
                        style={{ fontWeight: "bold" }}
                        color={colors.background}
                      />
                    </Pressable>
        </View>
                </>
        )}
        
      </View>
    </Modal>
    );
  }

  export default FindGroupOnMap

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
  