import {
    FlatList,
    ListRenderItemInfo,
    Pressable,
    StyleSheet
  } from "react-native";
  import { colors } from "../../constants";
  import { GroupGender } from "../../types/types";
  import { Text } from "../defaults";
  import { Checkbox } from "../generics/Checkbox";
  const genders: {
    label: string;
    value: GroupGender;
  }[] = [
    { label: "Man", value: "Man" },
    { label: "Woman", value: "Woman" },
    { label: "Non-Binary", value: "Nonbinary" },
    { label: "All Welcome", value: "All Welcome" }
  ];
  
  export default function GroupGenderPicker(props: {
    gender: string;
    setGender: (val: string) => void;
    hasBorder?: boolean;
  }) {
    const { gender, setGender, hasBorder = false } = props;
    const RenderItem = ({ item }: ListRenderItemInfo<typeof genders[number]>) => {
      return (
        <Pressable
          onPress={() => {
            setGender(item.value);
          }}
          style={[styles.listItem, { borderWidth: hasBorder ? 1 : 0 }]}
        >
          <Text style={{ flex: 1 }}>{item.label}</Text>
          <Checkbox
            hitSlop={{ left: 300, top: 10, bottom: 10 }}
            isChecked={gender.includes(item.value)}
            onPress={() => {
              setGender(item.value);
            }}
            variant="circle"
          />
        </Pressable>
      );
    };
  
    return (
      <FlatList
        data={genders}
        renderItem={RenderItem}
        style={{ width: "100%" }}
      />
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      flex: 1
    },
    topContainer: {
      paddingHorizontal: 15
    },
    separator: {
      height: 20
    },
    largeSeparator: {
      height: 40
    },
  
    listItem: {
      width: "100%",
      backgroundColor: colors.background,
      borderColor: colors.lightGreyBorder,
      paddingLeft: 15,
      height: 40,
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 8,
      marginVertical: 4
    }
  });
  