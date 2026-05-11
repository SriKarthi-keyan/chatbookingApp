import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = {
  title: string;
  description?: string;
  icon?: string;
};

export function EmptyState({ title, description, icon = 'chatbubbles-outline' }: Props) {
  return (
    <View style={styles.wrap}>
      <Icon name={icon} size={42} color={colors.textMuted} />
      <Text style={[typography.subtitle, styles.title]}>{title}</Text>
      {description ? (
        <Text style={[typography.body, styles.desc]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  desc: {
    textAlign: 'center',
  },
});
