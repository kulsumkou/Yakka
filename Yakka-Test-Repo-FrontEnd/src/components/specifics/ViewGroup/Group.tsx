import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { format, isToday } from "date-fns";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { GroupType, UserStatus } from "../../../types/types";
import { Text } from "../../defaults";
import { GroupCoverPhoto } from "./GroupCoverPhoto";
import { GroupPicHeader } from "./GroupPicHeader";
import { GroupInteractions } from "./GroupInteractions";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FindGroupOnMap from "../FindGroups/FindGroupOnMap";

type Props = {
  group: GroupType;
  isOrganiser: boolean;
  refetchGroup: () => void;
};

export const Group = ({ group, isOrganiser, refetchGroup }: Props) => {
  const categories = group.categories.join(', ');
  const location = group.locationName.join(', ');

  const [locateOnMapOpen, setLocateOnMapOpen] = useState<boolean>(false);
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const formattedStartDate = isToday(new Date(group.date))
    ? `Today`
    : format(new Date(group.date), "PP").toString();
  const formattedEndDate = isToday(new Date(group.endTime))
    ? "Today"
    : format(new Date(group.endTime), "PP").toString();
  const startTime = format(new Date(group.date), "HH:mma");
  const endTime = format(new Date(group.endTime), "HH:mma");

  const statusIndicator = (status: UserStatus) =>
    clsx(
      // {
      //   "bg-green-500": status === "AVAILABLE_TO_YAKKA",
      //   "bg-yellow-500": status === "AVAILABLE_TO_CHAT",
      //   "bg-red-500": status === "UNAVAILABLE"
      // },
      `w-5 h-5 rounded-full items-center self-center justify-center ml-1`
    );

  const DataView = ({ title, value }: { title: string; value: string }) => {
    return (
      <View className="mx-6  my-2">
        <Text>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };
  function formatCurrency(value: number) {
    return `£ ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  }

  const navigation =
    useNavigation<RootLoggedInScreenProps<"ViewGroup">["navigation"]>();
  return (
    <>
    <ScrollView
      className="z-[0] -mt-11 bg-white"
      style={{ height: Dimensions.get("window").height, elevation: 0 }}
      >
      <GroupCoverPhoto group={group} isOrganiser={isOrganiser} />
      <View className=" items-stretch ">
        <View className="flex-1 flex-row items-center justify-between px-4">
          <GroupPicHeader
            isOrganiser={true}
            group={group}
            onUploadPhoto={() => refetchGroup()}
            />
          {/*                         */}
          {/* stats right */}
        </View>
        {isInviting ? (
          <GroupInteractions
          group={group}
          isInviting={isInviting}
          setIsInviting={setIsInviting}
          />
          ) : (
            <View className="w-full pt-3">
            {/* image left  stats right */}
            {/* image left */}
            <Text size="lg" className="w-full text-center font-bold px-4">
              {group.name}
            </Text>
            <GroupInteractions
              group={group}
              isInviting={isInviting}
              setIsInviting={setIsInviting}
              />
            {/*             */}
            {/*                DATE // TIME // FEE               */}
            <DataView
              title="Your status"
              value={
                group.isOrganiser
                ? "Organiser"
                : group.isMember
                ? "Member"
                : group.isInvited
                ? "Invited"
                : "Not joined"
              }
              
              />
            
            <View className="flex-row items-center justify-between">
              <DataView title="Date" value={formattedStartDate} />
              <DataView title="Time" value={`${startTime} - ${endTime}`} />
              <DataView
                title="Fee"
                value={formatCurrency(group.paymentAmount)}
                />
            </View>
            <View className="mx-6  my-2">
            <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                      >
                      <Text preset="b">Location</Text>
                      <Ionicons
                        name={"location-sharp"}
                        size={25}
                        color={colors.blueText}
                        style={{ marginLeft: 10 }}
                        />
                      <TouchableOpacity onPress={() => setLocateOnMapOpen(true)}>
                        <Text
                          style={{ color: colors.blueText, marginLeft: 10 }}
                          >
                          Locate on Map
                        </Text>
                      </TouchableOpacity>
                    </View>
              <Text style={styles.value}>{location}</Text>
            </View>
            <DataView title="Gender" value={group?.groupGender} />
            <DataView title="Category" value={categories? categories : 'Not Available'} />
            <DataView title="About" value={group.description ? group.description : "Not Available"} />
            {group.hashtags && (
              <DataView
              title="Hashtags"
              value={group?.hashtags.map(val => `#${val}`).join(", ")}
              />
              )}
          </View>
        )}
      </View>
      
    </ScrollView>
    <FindGroupOnMap
      isVisible={locateOnMapOpen}
      setIsVisible={setLocateOnMapOpen}
      fetch={false}
      group={group}
      />
      </>
  );
};

const styles = StyleSheet.create({
  title: {},
  value: {
    color: colors.dim
  }
});
