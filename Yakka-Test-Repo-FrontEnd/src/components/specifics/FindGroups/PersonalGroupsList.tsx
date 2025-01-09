// import { Ionicons } from "@expo/vector-icons";
import React from "react";
// import { Pressable, View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
// import { NearbyUsersResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
// import { UserStatusObject } from "../../../utils/UserStatusToText";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
// import ImageWithStatus from "../../generics/ImageWithStatus";
// import { UserPressable } from "../../generics/UserPressable";
import EmptyList from "../../generics/Icons/EmptyList";
import { colors, listColors } from "../../../constants";
import GroupImage from "../../generics/GroupImage ";
// import GroupImageWithInvite from "../../generics/GroupImageWithInvite";
import { Rating } from "react-native-ratings";
import { GroupPressable } from "../ViewGroup/GroupPressable";
import { PersonalGroupsResponse } from "../../../types/types";
import { ActivityIndicator, View } from "react-native";
import GroupImageWithInvite from "../../generics/GroupImageWithInvite";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { format, isToday } from "date-fns";

export default function NearGroupsList({
  filterQueryParams,
  openAddYakkaModal
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
}) {
  const personalQuery = useInfiniteQuery<PersonalGroupsResponse>(
    [QueryKeys.PERSONAL_GROUPS, filterQueryParams],
    ({ pageParam }) => {
      return goFetchLite("groups/planned", {
        method: "GET",
        params: { ...filterQueryParams, page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true
    }
  );
  return (
    <> 
    {personalQuery.isLoading && (
      <View
      style={[
        {
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center"
        }
      ]}
    >
      <ActivityIndicator size={100} color={colors.greenYakka} />
    </View>
    )}
    {personalQuery.data?.pages && !personalQuery.isLoading && (
      <ColouredList
        keyPrefix="nearby" 
        onEndReached={() => {
          if (personalQuery.hasNextPage) personalQuery.fetchNextPage();
        }}
        startZIndex={99}
        ListEmptyComponent={() => <EmptyList />}
        items={personalQuery.data.pages.flatMap(
          page =>
          // @ts-expect-error
            page.planned?.map((group, index) => {
              return {
                data: group,
                content: (
                  <GroupPressable
                  key={group.id}
                    groupId={group.id}
                    className="flex-row justify-between items-center w-full"
                  >
                    <View className="gap-y-2 flex-1">
                      <View className="flex-column justify-between items-left">
                            <Text
                              size="lg"
                              weight="500"
                              style={{ color: "white" }}
                            >
                              {group.name}
                            </Text>
                        <View className="items-center flex-row mt-2">
                        <View style={{
                          backgroundColor: colors.greenYakka, // You can change the background color
                          borderRadius: 10, // Adjust the border radius for rounded corners
                          width: 35,
                          height: 25,
                          padding: 5, // Adjust the padding to control the box size
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 5,
                          }}>
                          <Text style={{
                            color: '#fff', // Text color
                            fontSize: 12, // Text size
                            fontWeight: 'bold', // Text weight

                          }}>{group?.participants.length > 0 ? group?.participants.length + 1: 1}</Text>
                        </View>
                        {!group?.isPrivate ?<FontAwesome name="universal-access" size={20} color="white" />
                        : <FontAwesome name="user-secret" size={20} color="White" />}
                        <View className="flex-row items-end">
                          <Entypo name="location-pin" size={20} color="white" />
                            <Text size="sm2" color="white">
                              {group?.groupMiles}
                              {" mile"}
                              {group.groupMiles !== 1 && "s"}
                            </Text>
                          </View>
                        </View>
                        <View className="items-center flex-row mt-2">

                        <Text
                        size="sm"
                        style={{ color: "white", opacity: 0.7 }}
                        >
                        {group.date ? isToday(new Date(group.date))
    ? `Today at ${format(new Date(group.date), "p").toString()}`
    : format(new Date(group.date), "PPPppp").toString() : null}
                      </Text>
                      <Text
                        size="sm"
                        style={{ color: "white", opacity: 0.7 }}
                        >
                        {` ${Number(group?.paymentAmount).toLocaleString(
                          "en-GB",
                          {
                            style: "currency",
                            currency: "GBP"
                          }
                        )}`}
                      </Text>
                        </View>
                      <View style={{ height: 15 }} />
                      </View>
                      {/* TODO: Return user BIO from API */}
                      {/* TODO: Small preset is bigger than xs_white */}
                      {/* <Text
                        size="sm"
                        style={{ color: "white", opacity: 0.7 }}
                      >
                        {group.description.length > 100
                          ? group.description.slice(0, 100) + "..."
                          : group.description}
                      </Text> */}

                    </View>
                    <GroupPressable groupId={group.id} className="ml-6">
                      <GroupImageWithInvite
                        imageUrl={`${group?.profileImage ? group?.profileImage : require("../../../../assets/images/camera_icon.png")}`}
                        invited={false}
                      />
                    </GroupPressable>
                  </GroupPressable>
                )
              };
            }) || []
        )}
      />
    )}
  </>
  );
}
