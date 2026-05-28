import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const SOURCES = {
  black: require('../../assets/arandu-logo-black.png'),
  white: require('../../assets/arandu-logo-white.png'),
};

interface Props {
  variant?: 'black' | 'white';
  width?: number;
  style?: StyleProp<ImageStyle>;
}

// Proporção da arte original (≈ 600x230)
const RATIO = 230 / 600;

export function Logo({ variant = 'black', width = 160, style }: Props) {
  return (
    <Image
      source={SOURCES[variant]}
      resizeMode="contain"
      style={[{ width, height: width * RATIO }, style]}
    />
  );
}
