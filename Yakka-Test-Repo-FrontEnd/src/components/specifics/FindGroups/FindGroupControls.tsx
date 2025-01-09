import Modal from "@euanmorgan/react-native-modal";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Switch
} from "react-native";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { FindGroupsListType } from "../../../types/types";
import { Button, Text } from "../../defaults";
import ButtonGroupSelector from "../../generics/ButtonGroupSelector";
import FindGroupOnMap from "./FindGroupOnMap";
import { useRecoilValue } from "recoil";
import TextInputWithVoice from "../../defaults/TextInput/TextInputWithVoice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Checkbox } from "../../generics/Checkbox";
import InterestSearch from "../Interests/InterestSearch";
import HashtagSearch from "../Hashtags/HashtagSearch";
import { headerHeightAtom } from "../../../recoil/headerHeightAtom";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native";

const width = Dimensions.get("window").width;

const TwoCols = ({ cols }: { cols: React.ReactNode[] }) => (
  <View
    className={` justify-between px-cnt mb-4 ${
      width < 300 ? "flex-col" : "flex-row"
    }`}
  >
    {cols.map((col, i) => (
      <View key={i} className="flex-1 gap-y-2">
        {col}
      </View>
    ))}
  </View>
);

const defaultFilterState = {
  search: "",
  genders: {
    Man: {
      label: "Man",
      value: false
    },
    Woman: {
      label: "Woman",
      value: false
    },
    Nonbinary: {
      label: "Non-binary",
      value: false
    },
    AllWelcome: {
      label: "All",
      value: false
    }
  },
  minStarRating: {
    "5": {
      label: "5 stars",
      value: false
    },
    "4": {
      label: "4 stars",
      value: false
    },
    "3": {
      label: "3 stars",
      value: false
    }
  },
  maxDistanceMiles: {
    "5": {
      label: "Up to 5 miles",
      value: false
    },
    "10": {
      label: "5 - 10 miles",
      value: false
    },
    "200": {
      label: "10+ miles",
      value: false
    }
  }
};

export default function FindGroupControls({
  setSelectedGroupListType,
  setFilterQueryParams,
  selectedGroupListType,
  setFilterData
}: {
  setSelectedGroupListType: (type: FindGroupsListType) => void;
  setFilterQueryParams: (params?: string) => void;
  selectedGroupListType: FindGroupsListType;
  setFilterData?: any;
}) {
  const firstRender = useRef(true);

  // const {
  //   getLocation,
  //   locationMutation,
  //   isLoading: isLocationLoading
  // } = useLocation();

  // const handleRefreshLocation = async () => {
  //   const location = await getLocation();
  //   if (location) {
  //     locationMutation.mutate(location);
  //   }
  // };
  const [isDate, setIsDate] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const [locateOnMapOpen, setLocateOnMapOpen] = useState<boolean>(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const headerHeight = useRecoilValue(headerHeightAtom);

  const [filterState, setFilterState] = useState(defaultFilterState);

  const [interestsSearchText, setInterestsSearchText] = useState<string>("");
  const [hashtagsSearchText, setHashtagsSearchText] = useState<string>("");

  const [selectedInterests, setSelectedInterests] = useState<any[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<any[]>([]);

  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const toggleSwitch = () => setIsFavourite(previousState => !previousState);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const onChangeDateHandle = (value: number) => {
    if (value !== 0) {
      const date = new Date(value);
      setDate(date);
    } else {
      setDate(new Date());
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    applyFiltersHandler();
  }, [filterState.search]);

  const applyFiltersHandler = (search?: string) => {
    // Build up query string
    const query = Object.entries(filterState).reduce((acc, [key, value]) => {
      const checked = Object.entries(value).filter(
        ([_, { value }]) => value === true
      );
      if (checked.length > 0) {
        acc[key] = checked.map(([key]) => key).join(",");
      }
      return acc;
    }, {} as any);

    if (selectedInterests.length > 0) {
      query["interests"] = selectedInterests.map(({ id }) => id).join(",");
    }

    if (selectedHashtags.length > 0) {
      query["hashtags"] = selectedHashtags.map(({ id }) => id).join(",");
    }

    if (search || filterState.search) {
      query["search"] = search || filterState.search;
    }
    if (isDate) {
      query["date"] = date;
    }
    if (isFavourite) {
      query["favorite"] = 1;
    }
    if (paymentAmount !== 0) {
      query["fee"] = paymentAmount;
    }

    setFilterQueryParams(query);
    setSelectedGroupListType("filter");
    setFilterModalOpen(false);
  };

  const handlePaymentAmount = (e: string) => {
    console.log("CHECKING INITIAL VALUE", e);
    // Extract numeric value from the string
    const numericValue = Number(e.split("£")[1].replace(/,/g, "").trim());
    // Check if it's a valid number
    console.log("checkingConvertedValue", numericValue);

    if (
      isNaN(numericValue) ||
      numericValue === null ||
      numericValue === undefined
    ) {
      setPaymentAmount(0);
    } else {
      setPaymentAmount(numericValue);
    }
  };

  const searchFilterHandler = (search: string) => {
    setFilterState(filter => ({
      ...filter,
      search
    }));
  };

  const arrayWithoutFilter = [
    {
      label: "Near Me",
      onPress: () => {
        setSelectedGroupListType("nearby");
      }
    },
    {
      label: "Recommended",
      onPress: () => {
        setSelectedGroupListType("recommended");
      }
    },
    {
      label: "Personal",
      onPress: () => {
        setSelectedGroupListType("personal");
      }
    }
  ];

  return (
    <>
      <View className={`gap-y-3 z-[1] px-cnt bg-white  ${ClassNames.OVERLAP} `}>
        <ButtonGroupSelector
          defaultSelected={
            selectedGroupListType === "nearby"
              ? 0
              : selectedGroupListType === "recommended"
              ? 1
              : selectedGroupListType === "personal"
              ? 2
              : selectedGroupListType === "filter"
              ? 3
              : undefined
          }
          grow
          buttons={arrayWithoutFilter}
        />

        <View className="h-9">
          {!searchBoxOpen && (
            <View className="flex flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setSearchBoxOpen(true)}>
                <Ionicons
                  name="search"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color={colors.greenYakka}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLocateOnMapOpen(true)}>
                <Ionicons
                  name="location-sharp"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color={colors.blueText}
                />
                <Text
                  style={{ color: colors.black, fontSize: 10, marginLeft: -5 }}
                >
                  View Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterModalOpen(true)}>
                <AntDesign
                  name="filter"
                  size={Platform.OS === "ios" ? 24 : 22}
                  color={
                    selectedGroupListType === "filter"
                      ? colors.greenYakka
                      : colors.lightGrey
                  }
                />
                <Text
                  size="sm"
                  style={{
                    color: colors.black,
                    fontSize: 10,
                    fontFamily:
                      selectedGroupListType === "filter"
                        ? "Roboto_900Black"
                        : undefined
                  }}
                >
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInputWithVoice
            debounceTime={300}
            callbackDependencies={[filterState]}
            visible={searchBoxOpen}
            autoFocus
            onSearch={searchFilterHandler}
            onClosePress={() => setSearchBoxOpen(false)}
            placeholder="Search for a Group"
          />
        </View>
      </View>
      <Modal
        animationIn={"slideInRight"}
        animationOut="slideOutRight"
        onBackdropPress={
          filterModalOpen ? () => setFilterModalOpen(false) : undefined
        }
        backdropOpacity={0}
        isVisible={filterModalOpen}
        style={{
          margin: 0
        }}
      >
        <View
          style={{ top: headerHeight }}
          className="bg-white pt-4 w-full absolute self-end shadow-lg h-[100%] pb-4"
        >
          <View className="flex-row justify-between w-full px-cnt mb-5">
            {/* TODO:  A preset for white button with Shadow */}
            <View className="flex flex-row items-center gap-x-3">
              <TouchableOpacity
                onPress={() => {
                  setFilterState(defaultFilterState);
                  setSelectedHashtags([]);
                  setSelectedInterests([]);
                  setInterestsSearchText("");
                  setHashtagsSearchText("");
                  setFilterQueryParams(undefined);
                  setPaymentAmount(0);
                  setDate(new Date());
                  setIsDate(false);
                  setIsFavourite(false);
                }}
              >
                <Text preset="blue">Clear All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.greyCircle}
              onPress={() => setFilterModalOpen(false)}
            >
              <Ionicons
                size={22}
                name="close"
                style={{ fontWeight: "bold" }}
                color={colors.dim}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            className="w-full"
            extraScrollHeight={headerHeight + 20}
          >
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Gender</Text>
                  {(
                    Object.keys(
                      defaultFilterState.genders
                    ) as (keyof typeof filterState.genders)[]
                  ).map(g => {
                    const gender = filterState.genders[g];
                    return (
                      <Checkbox
                        key={g}
                        text={gender.label}
                        isChecked={gender.value}
                        onPress={isChecked => {
                          setFilterState({
                            ...filterState,
                            genders: {
                              ...filterState.genders,
                              [g]: {
                                ...gender,
                                value: isChecked
                              }
                            }
                          });
                        }}
                      />
                    );
                  })}
                </>,
                <>
                  <Text preset="blg">Distance</Text>
                  {(
                    Object.keys(
                      filterState.maxDistanceMiles
                    ) as (keyof typeof filterState.maxDistanceMiles)[]
                  ).map(d => {
                    const distance = filterState.maxDistanceMiles[d];
                    return (
                      <Checkbox
                        key={d}
                        text={distance.label}
                        isChecked={distance.value}
                        onPress={isChecked => {
                          const newFilterState = {
                            ...filterState,
                            maxDistanceMiles: {
                              ...filterState.maxDistanceMiles,
                              [d]: {
                                ...distance,
                                value: isChecked
                              }
                            }
                          };
                          Object.keys(newFilterState.maxDistanceMiles).forEach(
                            key => {
                              if (key !== d) {
                                // @ts-ignore
                                newFilterState.maxDistanceMiles[key].value =
                                  false;
                              }
                            }
                          );
                          setFilterState(newFilterState);
                        }}
                      />
                    );
                  })}
                </>
              ]}
            />
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Rating</Text>
                  {(
                    Object.keys(
                      filterState.minStarRating
                    ) as (keyof typeof filterState.minStarRating)[]
                  )
                    .reverse()
                    .map(r => {
                      const rating = filterState.minStarRating[r];
                      return (
                        <Checkbox
                          key={r}
                          text={rating.label}
                          isChecked={rating.value}
                          onPress={isChecked => {
                            //  Set all other ratings to false
                            const newFilterState = {
                              ...filterState,
                              minStarRating: {
                                ...filterState.minStarRating,
                                [r]: {
                                  ...rating,
                                  value: isChecked
                                }
                              }
                            };
                            Object.keys(newFilterState.minStarRating).forEach(
                              key => {
                                if (key !== r) {
                                  // @ts-ignore
                                  newFilterState.minStarRating[key].value =
                                    false;
                                }
                              }
                            );
                            setFilterState(newFilterState);
                          }}
                        />
                      );
                    })}
                </>
              ]}
            />
            <View className="px-cnt mt-2 z-[10]">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1
                }}
              >
                <Text preset="blg">Favourites</Text>
                <Switch
                  className="ml-0.5"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  trackColor={{ false: "#767577", true: "#03C04A" }}
                  thumbColor={isFavourite ? "#03C04A" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isFavourite}
                />
              </View>
            </View>
            <View className="px-cnt mt-2 z-[10]">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text preset="blg">Fee</Text>
                <TextInput
                  value={` ${Number(paymentAmount).toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP"
                  })}`}
                  onChangeText={handlePaymentAmount}
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    width: 120,
                    marginLeft: 10,
                    height: 25,
                    justifyContent: "center",
                    textAlign: "center",
                    color: "#00000080",
                    borderColor: "#00000080",
                    borderRadius: 5
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#7676801F",
                    marginLeft: 5,
                    borderRadius: 5,
                    flexDirection: "row"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (paymentAmount > 0) {
                        setPaymentAmount(
                          paymentAmount - 1 <= 0 ? 0 : paymentAmount - 1
                        );
                      }
                    }}
                  >
                    <AntDesign
                      name={"minus"}
                      size={15}
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 4
                      }}
                      color={"#000"}
                    />
                  </TouchableOpacity>
                  <Text style={{ color: "#3C3C432E", fontSize: 14 }}>|</Text>
                  <TouchableOpacity
                    onPress={() => setPaymentAmount(paymentAmount + 1)}
                  >
                    <AntDesign
                      name={"plus"}
                      size={15}
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 4
                      }}
                      color={"#000"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="px-cnt mt-2 z-[10]">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1
                }}
              >
                <Text preset="blg">Date</Text>
                {isDate && (
                  <DateTimePicker
                    disabled={!isDate}
                    value={date}
                    mode="date"
                    display="default"
                    onChange={value =>
                      onChangeDateHandle(
                        value?.nativeEvent?.timestamp
                          ? value.nativeEvent.timestamp
                          : 0
                      )
                    }
                  />
                )}
                <Switch
                  className="ml-0.5"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  trackColor={{ false: "#767577", true: "#03C04A" }}
                  thumbColor={isDate ? "#03C04A" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setIsDate(!isDate)}
                  value={isDate}
                />
              </View>
            </View>
            <View className="px-cnt mt-2 z-[10]">
              <Text preset="blg">Categories</Text>
              <InterestSearch
                zIndex={10}
                searchText={interestsSearchText}
                setSearchText={setInterestsSearchText}
                selectedItems={selectedInterests}
                setSelectedItems={setSelectedInterests}
              />
            </View>
            <View className="px-cnt mt-4 z-[9]">
              <Text preset="blg">Hashtags</Text>
              <HashtagSearch
                zIndex={9}
                searchText={hashtagsSearchText}
                setSearchText={setHashtagsSearchText}
                selectedItems={selectedHashtags}
                setSelectedItems={setSelectedHashtags}
              />
            </View>
            <View className="px-cnt mt-12 mb-12">
              <Button
                onPress={() => applyFiltersHandler()}
                preset="wide"
                text="Apply Selected"
              />
            </View>
            <View style={{ height: 80 }} />
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <FindGroupOnMap
        isVisible={locateOnMapOpen}
        setIsVisible={setLocateOnMapOpen}
      />
    </>
  );
}
const styles = StyleSheet.create({
  greyCircle: {
    backgroundColor: colors.lightGreyBorder,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },
  arrow: {
    fontSize: 18,
    color: "black"
  },
  dropdownButton: {
    flexDirection: "row", // Display text and arrow side by side
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F9F9F9EF",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#F9F9F9EF"
  }
});
