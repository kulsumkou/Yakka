import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { GroupType, InitiateChat } from "../../../types/types";
import { JoinGroup } from "./JoinGroup";
import { ShareGroup } from "./ShareGroup";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { InviteFriends } from "./InviteFriends";
import { colors } from "../../../constants";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
import { goFetchLite } from "../../../utils/goFetchLite";
import Toast from "react-native-toast-message";

export const GroupInteractions = (props: { group: GroupType, isInviting:boolean, setIsInviting: ((value:boolean) => void) }) => {
  const { group , isInviting, setIsInviting} = props;
  // const chatQuery = useQuery<InitiateChat>(
  //   QueryKeys.initiateChat(group.id),
  //   () => goFetchLite(`chats/${group.id}`, { method: "POST" }),
  //   {
  //     // Don't auto fetch the query if there is no selected friend
  //     enabled: false,
  //     // On success only runs if the query has refetched, we als need to nabigate if we pull from cache

  //     onSettled: (data, error) => {
  //       if (data) {
  //         // @ts-ignore
  //         navigation.navigate("Chat", {
  //           chatId: data.chatId,
  //           friend: group.id
  //         });
  //       }
  //     },

  //     onSuccess: data => {
  //       // @ts-ignore
  //       navigation.navigate("Chat", {
  //         chatId: data.chatId,
  //         friend: group.id
  //       });
  //     },
  //     onError: (err: any) => {
  //       Toast.show({
  //         type: "error",
  //         text1: err?.response?.data?.message || "Something went wrong"
  //       });
  //     }
  //   }
  // );

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: 'space-between',
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 20,
        flexDirection: "row",
      }}
    >
      {!group.isPrivate ? 
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <MaterialIcons name="public" size={28} color={colors.greenYakka} /> 
        <Text style={{marginLeft: 5}}>Public</Text>
      </View>
      : 
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <MaterialIcons name="public-off" size={28} color={colors.greyText} /> 
        <Text style={{marginLeft: 5}}>Private</Text>
      </View>
}
      {!isInviting && !group.isOrganiser && <JoinGroup group={group} />}
          {group.isOrganiser && <InviteFriends
          group={group}
          isInviting={isInviting}
          setIsInviting={setIsInviting}
          />}
      {group.isMember && (<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Ionicons name="checkmark-circle" size={28} color={colors.greenYakka}  />
        <Text style={{marginLeft: 1}}>Joined</Text>
      </View>) }
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginRight: 5}}>Chat</Text>
        <Pressable onPress={()=> console.log("CHAT PRESSED")}>
          <Ionicons name="ios-chatbubble-ellipses-outline" size={28} color={colors.greenYakka} />
        </Pressable>
      </View>
    </View>
  );
};
