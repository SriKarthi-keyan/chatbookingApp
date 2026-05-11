import React, { PropsWithChildren } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}>;

export function Screen({ children, style, edges }: Props) {
  return (
    <SafeAreaView
      style={[styles.root, style]}
      edges={edges ?? ['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
});
