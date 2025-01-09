import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Switch
} from "react-native";
import { colors } from "../../../../constants";
import { RootLoggedInScreenProps } from "../../../../navigation/navigation.props";
import { Text } from "../../../../components/defaults";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DatePicker, {
  Time
} from "../../../../components/defaults/DateTimePicker";
import { GroupCoverImage } from "../../../../components/specifics/ViewGroup/GroupCoverImage";
import { GroupProfileImageUploader } from "../../../../components/specifics/ViewGroup/GroupProfileImage";
import { useHeaderHeight } from "@react-navigation/elements";
import { BottomModal } from "../../../../components/defaults/BottomSheetModal";
import { SelectHashtags } from "../../../../components/specifics/SelectHashtags";
import { InterestList } from "../../../../components/specifics/Interests/InterestList";
import { useMutation } from "react-query";
import { MutationKeys } from "../../../../constants/queryKeys";
import { goFetchLite } from "../../../../utils/goFetchLite";
import Toast from "react-native-toast-message";
import MapWithSearch from "../Components/MapWithSearch";
import GroupGenderPicker from "../../../../components/specifics/GroupGenderPicker";
import ListPicker from "../../../../components/generics/ListPicker";
import { frequency, repeatFor } from "../../../../constants/staticData";
import { useNavigation } from "@react-navigation/native";

export default function AddGroupScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"CreateGroup">) {
  /** OPTION VALUES */
  const height = useHeaderHeight();
  console.log("CHECK NAVIGATION", navigation);

  const [interestsModalVisible, setInterestsModalVisible] =
    useState<boolean>(false);

  /** MODAL HANDLERS */
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);
  const [frequencyModalVisible, setFrequencyModalVisible] =
    useState<boolean>(false);
  const [repeatForModalVisible, setRepeatForModalVisible] =
    useState<boolean>(false);
  const [hashtagsModalVisible, setHashtagsModalVisible] =
    useState<boolean>(false);

  const navigator = useNavigation();

  /** LOADING STATES */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**FORM VALUE STATES */

  /**GROUP IMAGES */
  const [groupCoverImage, setGroupCoverImage] = useState<string | null>(null);
  const [groupProfileImage, setGroupProfileImage] = useState<string | null>(
    null
  );

  const [name, setName] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [time, setTime] = useState<Time>({
    date: new Date(new Date().getTime() + 20 * 60000),
    startTime: new Date(new Date().getTime() + 20 * 60000),
    endTime: new Date(new Date().getTime() + 40 * 60000)
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
    selectedWith: "map" | "search";
  } | null>();

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const [gender, setGender] = useState<string>("");
  // const [groupGender, setGroupGender] = useState<string>("");
  const [groupFrequency, setGroupFrequency] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [groupRepeatFor, setGroupRepeatFor] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const [chosenInterests, setChosenInterests] = useState<number[]>([]);
  const [activeComponent, setActiveComponent] = useState<
    "gender" | "interests" | "hashtags" | "jobs" | "frequency"
  >();

  const [checkErrors, setCheckErrors] = useState<{
    name: string | undefined;
    description: string | undefined;
    location: string | undefined;
    groupGender: string | undefined;
    frequency: string | undefined;
    repeatFor: string | undefined;
    category: string | undefined;
  }>({
    name: undefined,
    description: undefined,
    location: undefined,
    groupGender: undefined,
    frequency: undefined,
    repeatFor: undefined,
    category: undefined
  });

  const handlePaymentAmount = (e: string) => {
    // Extract numeric value from the string
    const numericValue = Number(e.replace(/[^\d.]/g, ""));

    // Check if it's a valid number
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

  const createGroupMutation = useMutation(
    MutationKeys.CREATE_GROUP,
    () =>
      goFetchLite(`groups`, {
        method: "POST",
        body: {
          name,
          isPrivate,
          description,
          profileImage: groupProfileImage,
          coverImage: groupCoverImage,
          date: new Date(time.date),
          startTime: new Date(time.startTime.getTime()),
          endTime: new Date(time.endTime.getTime()),
          coordinates: {
            latitude: selectedLocation?.lat,
            longitude: selectedLocation?.lng
          },
          categories: chosenInterests,
          locationName: selectedLocation?.name,
          frequency: groupFrequency,
          repeatFor: groupRepeatFor,
          paymentAmount,
          groupGender: gender,
          paymentUrl,
          hashtags: hashtags
        }
      }),
    {
      onMutate: variables => setIsLoading(true),
      onSuccess: (data, variables) => {
        // console.log("grp", data);
        Toast.show({
          text1: `Successfully created group`
        });
        setIsLoading(false);
        // clear navigation params so that the modal doesn't open again
        // @ts-expect-error
        navigator.replace("ViewGroup", {
          id: data.id
        });
      },
      onError: error => {
        console.log("ERROR", error);
        Toast.show({
          text1: `Something went wrong! Try Again`
        });
        setIsLoading(false);
      }
    }
  );

  const Validator = () => {
    let Checking = false;
    if (name.length < 3) {
      if (!name) {
        setCheckErrors({ ...checkErrors, name: "Group Name is Required" });
      } else {
        setCheckErrors({ ...checkErrors, name: "Group Name must be valid" });
      }
    } else if (description.split(" ").length < 3) {
      if (!description) {
        setCheckErrors({
          ...checkErrors,
          description: "Group description is Required"
        });
      } else {
        setCheckErrors({
          ...checkErrors,
          description: "Group description must be meaningful"
        });
      }
    } else if (!selectedLocation?.lat && !selectedLocation?.lng) {
      setCheckErrors({ ...checkErrors, location: "Location is required" });
    } else if (!gender) {
      setCheckErrors({
        ...checkErrors,
        groupGender: "Group Gender is required"
      });
    } else if (!groupFrequency) {
      setCheckErrors({
        ...checkErrors,
        frequency: "Reoccurring Frequency is required"
      });
    } else if (!groupRepeatFor) {
      setCheckErrors({
        ...checkErrors,
        repeatFor: "Reoccurring RepeatFor is required"
      });
    } else if (chosenInterests.length === 0) {
      setCheckErrors({
        ...checkErrors,
        category: "Group Category is Required"
      });
    } else if (chosenInterests.length > 3) {
      setCheckErrors({
        ...checkErrors,
        category: "Maximum 3 Categories are Allowed"
      });
    } else {
      Checking = true;
    }

    return Checking;
  };

  const handleSubmitGroup = () => {
    const valid = Validator();

    if (valid) {
      createGroupMutation.mutate();
    } else {
      console.log(checkErrors);
      Toast.show({
        text1: "Following Field is required",
        type: "error"
      });
    }
  };

  const setMapErrors = () => {
    setCheckErrors({ ...checkErrors, location: undefined });
  };

  //Different modals
  return (
    <>
      {isLoading ? (
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
      ) : (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={height}
            style={styles.container}
          >
            <ScrollView
              style={{
                backgroundColor: colors.background,
                marginTop: -40
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.inner}>
                <View>
                  <TouchableOpacity>
                    <GroupCoverImage base64={setGroupCoverImage} />
                  </TouchableOpacity>
                  <View className="items-center">
                    <GroupProfileImageUploader base64={setGroupProfileImage} />
                  </View>
                </View>
                <View className="p-2">
                  <View style={{ flexDirection: "row" }}>
                    <Text preset="b" className="">
                      Group Name
                    </Text>
                    <View style={{ alignItems: "flex-end", flex: 1 }}>
                      <View
                        className="flex-row gap-x-2"
                        style={{ alignItems: "center" }}
                      >
                        <Text preset="b" style={{ marginBottom: 5 }}>
                          Private
                        </Text>
                        <Switch
                          trackColor={{ false: "#767577", true: "#03C04A" }}
                          thumbColor={isPrivate ? "#03C04A" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={() => setIsPrivate(!isPrivate)}
                          value={isPrivate}
                        />
                      </View>
                    </View>
                  </View>
                  <TextInput
                    value={name}
                    onChangeText={value => {
                      setCheckErrors({ ...checkErrors, name: undefined });
                      setName(value);
                    }}
                    numberOfLines={1}
                    maxLength={30}
                    style={[
                      styles.input,
                      {
                        borderBottomColor: checkErrors?.name ? "red" : undefined
                      }
                    ]}
                    placeholder={"e.g. Business"}
                  />
                  {checkErrors?.name && (
                    <Text style={styles.errorText}>{checkErrors?.name}</Text>
                  )}
                  <View className="mt-4 mb-2">
                    <Text preset="b" className="mb-3">
                      Group Description
                    </Text>
                    <TextInput
                      numberOfLines={10}
                      value={description}
                      multiline={true}
                      onChangeText={value => {
                        setCheckErrors({
                          ...checkErrors,
                          description: undefined
                        });
                        setDescription(value);
                      }}
                      style={[
                        styles.input,
                        {
                          borderBottomColor: checkErrors?.description
                            ? "red"
                            : undefined
                        }
                      ]}
                      maxLength={500}
                      placeholder={"Description..."}
                    />
                    {checkErrors?.description && (
                      <Text style={styles.errorText}>
                        {checkErrors?.description}
                      </Text>
                    )}
                  </View>
                  <View className="mt-4 mb-2">
                    {/* {Date and Time} */}
                    <Text preset="b" className="mb-3">
                      Date/Time
                    </Text>
                    <DatePicker time={time} setTime={setTime} />
                  </View>
                  {/* {Location} */}
                  <View className="mt-4 mb-2">
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text preset="b">Location</Text>
                      <Ionicons
                        name={"location-sharp"}
                        size={25}
                        color={
                          selectedLocation?.lat && selectedLocation?.lng
                            ? colors.blueText
                            : "#00000080"
                        }
                        style={{ marginLeft: 10 }}
                      />
                      <TouchableOpacity onPress={() => setMapOpen(true)}>
                        <Text
                          style={{ color: colors.blueText, marginLeft: 10 }}
                        >
                          Locate on Map
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="mt-4 mb-2"
                    style={styles.dropdownButton}
                    onPress={() => setMapOpen(!mapOpen)}
                  >
                    <Text style={{ flex: 1, color: "black" }}>{`${
                      selectedLocation?.name
                        ? selectedLocation?.name
                        : "Select Location"
                    }`}</Text>
                  </TouchableOpacity>
                  {checkErrors?.location && (
                    <Text style={styles.errorText}>
                      {checkErrors?.location}
                    </Text>
                  )}
                  <View className="mt-4 mb-2">
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text preset="b">Fee</Text>
                      <TextInput
                        value={`£${paymentAmount.toFixed(2)}`}
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
                        <Text style={{ color: "#3C3C432E", fontSize: 14 }}>
                          |
                        </Text>
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
                  <View className="mt-4 mb-2">
                    <Text preset="b">Payment url</Text>
                    <TextInput
                      value={paymentUrl}
                      onChangeText={e => setPaymentUrl(e)}
                      placeholder={"Payment Link"}
                      style={[styles.input]}
                      keyboardType="url"
                    />
                  </View>
                  <View className="mt-4 mb-2">
                    {/** GROUP GENDER VIEW */}
                    <Text preset="b">Group Gender</Text>
                  </View>
                  <TouchableOpacity
                    className="mb-2"
                    style={styles.dropdownButton}
                    onPress={() => {
                      setCheckErrors({
                        ...checkErrors,
                        groupGender: undefined
                      });
                      setGenderModalVisible(true);
                      setActiveComponent("gender");
                    }}
                  >
                    <Text style={{ flex: 1, color: "black" }}>
                      {gender ? gender : "Select Gender"}
                    </Text>
                    <Text style={[styles.arrow, { color: "black" }]}>▼</Text>
                  </TouchableOpacity>
                  {checkErrors?.groupGender && (
                    <Text style={styles.errorText}>
                      {checkErrors?.groupGender}
                    </Text>
                  )}
                  <View className="mt-4 mb-2">
                    <Text preset="b">Reoccurring</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    {/** FREQUENCY VIEW */}
                    <TouchableOpacity
                      className="mb-2"
                      style={[styles.dropdownButton, { width: "45%" }]}
                      onPress={() => {
                        setCheckErrors({
                          ...checkErrors,
                          frequency: undefined
                        });
                        setFrequencyModalVisible(true);
                        setActiveComponent("frequency");
                      }}
                    >
                      <Text style={{ color: "black" }}>
                        {groupFrequency ? groupFrequency : "Frequency"}
                      </Text>
                      <Text style={[styles.arrow, { color: "black" }]}>▼</Text>
                    </TouchableOpacity>
                    {/** REPEAT FOR VIEW */}
                    <TouchableOpacity
                      className="mb-2"
                      style={[styles.dropdownButton, { width: "45%" }]}
                      onPress={() => {
                        setCheckErrors({
                          ...checkErrors,
                          repeatFor: undefined
                        });
                        setRepeatForModalVisible(true);
                        setActiveComponent("frequency");
                      }}
                    >
                      <Text style={{ color: "black" }}>
                        {groupRepeatFor ? groupRepeatFor : "Repeat For"}
                      </Text>
                      <Text style={[styles.arrow, { color: "black" }]}>▼</Text>
                    </TouchableOpacity>
                  </View>
                  {checkErrors?.frequency && (
                    <Text style={styles.errorText}>
                      {checkErrors?.frequency}
                    </Text>
                  )}
                  {checkErrors?.repeatFor && (
                    <Text style={styles.errorText}>
                      {checkErrors?.repeatFor}
                    </Text>
                  )}
                  <View className="mt-4 mb-2">
                    <Text preset="b">Category</Text>
                  </View>
                  <TouchableOpacity
                    className="mb-2"
                    style={styles.dropdownButton}
                    onPress={() => {
                      setCheckErrors({ ...checkErrors, category: undefined });
                      setInterestsModalVisible(true);
                      setActiveComponent("interests");
                    }}
                  >
                    <Text style={{ flex: 1, color: "black" }}>
                      {chosenInterests.length !== 0
                        ? `${chosenInterests.length} ${
                            chosenInterests.length > 1
                              ? "Categories Selected"
                              : "Category Selected"
                          }`
                        : "Select Categories"}
                    </Text>
                    <Text style={[styles.arrow, { color: "black" }]}>▼</Text>
                  </TouchableOpacity>
                  {checkErrors?.category && (
                    <Text style={styles.errorText}>
                      {checkErrors?.category}
                    </Text>
                  )}
                  <Text className="mt-4 mb-2">Hashtags </Text>
                  <Text
                    style={styles.multilineInput}
                    onPress={() => {
                      setHashtagsModalVisible(true);
                      setActiveComponent("hashtags");
                    }}
                  >
                    {hashtags.map(val => `#${val}`).join(", ")}
                  </Text>
                  <View style={styles.buttonContainer} className="mt-4 mb-2">
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmitGroup}
                    >
                      <Text style={styles.buttonText}>Create</Text>
                      <AntDesign
                        name={"right"}
                        color={"#FFF"}
                        size={13}
                        style={styles.arrow}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
      <MapWithSearch
        isVisible={mapOpen}
        SetIsVisible={setMapOpen}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        checkErrors={setMapErrors}
      />

      {/** CATEGORY MODAL*/}
      <BottomModal
        snapPoints={["70%", "80%"]}
        isVisible={interestsModalVisible}
        setIsVisible={setInterestsModalVisible}
        // onDismiss={updateInterests}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            paddingBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setInterestsModalVisible(!interestsModalVisible)}
          >
            <Text style={{ color: colors.blueText, marginRight: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <InterestList
          chosenInterests={chosenInterests}
          setChosenInterests={setChosenInterests}
        />
      </BottomModal>
      {/** GENDER MODAL*/}
      <BottomModal
        isVisible={genderModalVisible}
        setIsVisible={setGenderModalVisible}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            paddingBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setGenderModalVisible(!genderModalVisible)}
          >
            <Text style={{ color: colors.blueText, marginRight: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <GroupGenderPicker gender={gender} setGender={setGender} />
      </BottomModal>

      {/** FREQUENCY MODAL*/}
      <BottomModal
        isVisible={frequencyModalVisible}
        setIsVisible={setFrequencyModalVisible}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            paddingBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setFrequencyModalVisible(!frequencyModalVisible)}
          >
            <Text style={{ color: colors.blueText, marginRight: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <ListPicker
          listItem={groupFrequency}
          setItemList={setGroupFrequency}
          items={frequency}
        />
      </BottomModal>

      {/** REPEAT FOR MODAL*/}
      <BottomModal
        snapPoints={["70%", "80%"]}
        isVisible={repeatForModalVisible}
        setIsVisible={setRepeatForModalVisible}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            paddingBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setRepeatForModalVisible(!repeatForModalVisible)}
          >
            <Text style={{ color: colors.blueText, marginRight: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <ListPicker
          listItem={groupRepeatFor}
          setItemList={setGroupRepeatFor}
          items={repeatFor}
        />
      </BottomModal>
      {/** HASHTAG MODAL*/}
      <BottomModal
        snapPoints={["70%", "80%"]}
        isVisible={hashtagsModalVisible}
        setIsVisible={setHashtagsModalVisible}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            paddingBottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => setHashtagsModalVisible(!hashtagsModalVisible)}
          >
            <Text style={{ color: colors.blueText, marginRight: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <SelectHashtags
          chosenHashtags={hashtags}
          setChosenHashtags={setHashtags}
          placeholder={"Start typing hashtags for your group"}
        />
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    color: colors.dim,
    paddingHorizontal: 0,
    marginTop: 8,
    marginBottom: 2
  },

  popupInput: {
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    color: colors.dim
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: colors.dim,
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 70
  },
  multilinePopupInput: {
    textAlignVertical: "top",
    color: colors.dim,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 70
  },
  pillBox: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: colors.background
  },
  coverImage: {
    backgroundColor: "#808080",
    height: 140,
    marginTop: 0,
    borderBottomLeftRadius: 50,
    overflow: "hidden"
  },
  buttonContainer: {
    color: colors.greenYakka,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  button: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.greenYakka
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 20
  },
  arrow: {
    fontSize: 18,
    color: "#FFF"
  },
  centeredView: {
    flex: 1,
    marginTop: 2
  },
  container: {
    flex: 1
  },
  inner: {
    flex: 1,
    justifyContent: "space-around"
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
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4
  }
});
