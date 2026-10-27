import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const swimmerLogoSource = require('../../assets/images/swimmer_logo.png');

export default function SwimmerLogo({ size = 70, strokeWidth = 2.5, style }) {
  const borderRadius = Math.round(size * 0.24);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          borderWidth: strokeWidth,
          borderColor: '#FFFFFF',
          overflow: 'hidden',
          backgroundColor: '#0080CA',
        },
        styles.container,
        style,
      ]}
    >
      <Image
        source={swimmerLogoSource}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
