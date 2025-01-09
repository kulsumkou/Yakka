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
  
  export default function ListPicker(props: {
    listItem: string;
    setItemList: (val: string) => void;
    hasBorder?: boolean;
    items: {
        label: string;
        value: string;
      }[]
  }) {
    const { listItem, setItemList, hasBorder = false, items } = props;
    const RenderItem = ({ item }: ListRenderItemInfo<typeof items[number]>) => {
      return (
        <Pressable
          onPress={() => {
            setItemList(item.value);
          }}
          style={[styles.listItem, { borderWidth: hasBorder ? 1 : 0 }]}
        >
          <Text style={{ flex: 1 }}>{item.label}</Text>
          <Checkbox
            hitSlop={{ left: 300, top: 10, bottom: 10 }}
            isChecked={listItem === item.value}
            onPress={() => {
                setItemList(item.value);
            }}
            variant="circle"
          />
        </Pressable>
      );
    };
  
    return (
      <FlatList
        data={items}
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
  