import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Platform, Share } from "react-native";
import { Button  } from "../../defaults";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { GroupType } from "../../../types/types";
interface ShareGroupProps {
  group: GroupType;
}

export const ShareGroup = ({ group }: ShareGroupProps) => {
  const navigation = useNavigation<RootLoggedInScreenProps<"Profile">>();

  // const share = async () => {
  //   await Sharing.shareAsync("https://yakkafamily.com");
  // };
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'YAKKA',
        message:
          `Find out others with shared interests and bring back genuine human connection in an increasingly digital world`,
        url:  Platform.OS === "ios" ?  'https://apps.apple.com/gb/app/yakka/id6448456575' : 'https://play.google.com/store/apps/details?id=com.yakkaworld.yakka&pli=1',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log(error)
    }
  };
  const [isLoading, setIsLoading] = React.useState();

  return (
    <Button
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        minHeight: 32,
        marginTop: 10
      }}
      preset="small"
      disabled={isLoading}
      onPress={onShare}
    >
      <Feather
        name="share"
        color="white"
        size={24}
        style={{ marginRight: 4 }}
      />
    </Button>
  );
};
