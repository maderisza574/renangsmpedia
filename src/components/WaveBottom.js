import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function WaveBottom({ color = '#E8F8FC', height = 44 }) {
  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 375 44"
        preserveAspectRatio="none"
        style={styles.svg}
      >
        {/* Layer 1: Translucent Aqua/Cyan Ripple (Creates glowing water depth seen in design) */}
        <Path
          d="M 0,22 C 60,34 130,38 190,16 C 255,-2 320,8 375,18 L 375,44 L 0,44 Z"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* Layer 2: Secondary soft light-blue wave fringe */}
        <Path
          d="M 0,28 C 75,38 140,32 205,14 C 270,-4 330,12 375,22 L 375,44 L 0,44 Z"
          fill="rgba(165, 243, 252, 0.6)"
        />

        {/* Layer 3: Main foreground wave cutting cleanly into page background */}
        <Path
          d="M 0,32 C 80,44 155,38 225,20 C 285,6 335,16 375,26 L 375,44 L 0,44 Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
  svg: {
    width: '100%',
  },
});
