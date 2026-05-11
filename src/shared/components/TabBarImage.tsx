import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  color: string;
  size: number;
};

/** Tab icon from PNG; `color` comes from React Navigation (active / inactive). */
export function TabBarImage({ source, color, size }: Props) {
  return (
    <Image
      source={source}
      style={{ width: size, height: size, tintColor: color }}
      resizeMode="contain"
    />
  );
}
