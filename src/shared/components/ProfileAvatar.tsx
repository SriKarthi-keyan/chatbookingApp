import React, { useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Images } from '../assets/images';
import { colors } from '../theme/colors';

type Props = {
  /** Remote or file URI; when missing or load fails, shows bundled placeholder. */
  uri?: string | null;
  size?: number;
};

export function ProfileAvatar({ uri, size = 96 }: Props) {
  const [failed, setFailed] = useState(false);
  const placeholder: ImageSourcePropType = Images.loginProfile;
  const trimmed = uri?.trim();
  const showRemote = Boolean(trimmed) && !failed;

  if (showRemote) {
    return (
      <FastImage
        source={{ uri: trimmed as string, priority: FastImage.priority.normal }}
        style={[styles.round, { width: size, height: size, borderRadius: size / 2 }]}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.round,
        styles.fallbackWrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}>
      <Image
        source={placeholder}
        style={[styles.placeholder, { width: size * 0.55, height: size * 0.55 }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  round: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fallbackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {},
});
