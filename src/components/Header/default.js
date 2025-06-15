import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function DefaultHeader(props) {
  const backScreen = () => {
    props.navigation.goBack();
  };
  return (
    <View style={styles.header}>
      <View>
        <TouchableOpacity onPress={backScreen} style={styles.section}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 25,
    backgroundColor: 'white',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  titleText: {
    color: 'white',
    fontSize: 18,
  },
});
