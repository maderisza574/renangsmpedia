import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function SplashWaves({ height = 240 }) {
  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 375 240"
        preserveAspectRatio="none"
        style={styles.svg}
      >
        <Defs>
          {/* Deep back wave gradient */}
          <SvgLinearGradient id="splashWaveBack" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00A8C6" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#0080B0" stopOpacity="0.6" />
          </SvgLinearGradient>

          {/* Middle dynamic wave gradient */}
          <SvgLinearGradient id="splashWaveMid" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00C4D6" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#008EB8" stopOpacity="0.9" />
          </SvgLinearGradient>

          {/* Front primary wave gradient */}
          <SvgLinearGradient id="splashWaveFront" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00BCE0" />
            <Stop offset="50%" stopColor="#00A2CE" />
            <Stop offset="100%" stopColor="#007BA8" />
          </SvgLinearGradient>
        </Defs>

        {/* 1. Back Wave Layer (Soft deep rolling water) */}
        <Path
          d="M 0,55 C 90,95 190,105 275,60 C 320,38 355,48 375,58 L 375,240 L 0,240 Z"
          fill="url(#splashWaveBack)"
        />

        {/* 2. Middle Wave Layer (Vibrant aqua wave swell) */}
        <Path
          d="M 0,90 C 65,58 135,52 200,88 C 265,122 325,112 375,78 L 375,240 L 0,240 Z"
          fill="url(#splashWaveMid)"
        />

        {/* 3. Front Wave Layer (Main rolling ocean wave) */}
        <Path
          d="M 0,132 C 75,156 145,172 215,152 C 272,136 318,96 375,112 L 375,240 L 0,240 Z"
          fill="url(#splashWaveFront)"
        />

        {/* 4. Soft Froth/Luminescence under crest */}
        <Path
          d="M 15,138 C 85,160 150,174 218,154 C 275,138 318,100 365,114"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Crisp White/Aqua Crest Highlight (Exact light reflection from design) */}
        <Path
          d="M 0,132 C 75,156 145,172 215,152 C 272,136 318,96 375,112"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});
