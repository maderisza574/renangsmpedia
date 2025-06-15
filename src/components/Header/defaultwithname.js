import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HeaderName(props) {
  const backScreen = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableOpacity onPress={backScreen} style={styles.section}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.sectionCenter}>
        <Text style={styles.titleText}>{props.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Lexend-Regular',
    fontWeight: 'bold',
  },
});
