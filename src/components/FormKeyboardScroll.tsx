import React, { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { HeaderHeightContext } from '@react-navigation/elements';

type Props = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

/**
 * Scrollable form layout with keyboard avoidance. Uses stack/tab header height on iOS;
 * Android relies on `adjustResize` plus this wrapper for consistent behavior.
 */
export function FormKeyboardScroll({ children, contentContainerStyle }: Props) {
  const headerHeight = React.useContext(HeaderHeightContext);
  const keyboardVerticalOffset =
    Platform.OS === 'ios' ? (typeof headerHeight === 'number' ? headerHeight : 0) : 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
