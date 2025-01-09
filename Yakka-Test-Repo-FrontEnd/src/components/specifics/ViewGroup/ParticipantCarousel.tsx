import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

interface Participant {
  id: string;
  name: string;
  avatar: string; // Change to the actual type of your avatar (e.g., string for image URL)
}

const data: Participant[] = [
  { id: '1', name: 'Jane', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg'},
  { id: '2', name: 'Martin', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '3', name: 'Martin3', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '4', name: 'Martin4', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '5', name: 'Martin5', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '6', name: 'Martin6', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '7', name: 'Martin7', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  { id: '8', name: 'Martin8', avatar: 'https://yakka-actual-dev.s3.eu-west-2.amazonaws.com/users/42/gcover/CdziuT9QV1HUdYISdxXZY.jpeg' },
  // Add more participants
];

const ParticipantCarousel: React.FC = () => {
  const limitedData = data.slice(0, 3); // Only take the first 2 participants

  const renderItem: React.FC<{ item: Participant }> = ({ item }) => (
    <View style={styles.participantContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={limitedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.namesContainer}>
        {limitedData.map((participant) => (
          <Text key={participant.id} style={styles.name}>{participant.name},</Text>
        ))}
      </View>
      {data.length > 2 && (
        <Text style={styles.othersText}>{` and ${data.length - 2} others`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  participantContainer: {
    alignItems: 'center',
    marginRight: 1,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginBottom: 5,
  },
  namesContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 10,
    marginLeft: 1,
    color: 'white'
  },
  othersText: {
    fontSize: 10,
    color: 'white',
  },
});

export default ParticipantCarousel;