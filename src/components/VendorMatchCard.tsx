import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { ProfileAvatar } from './ProfileAvatar';
import { MatchedVendor } from '../models';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDistance } from '../utils/geo';

type Props = {
  vendor: MatchedVendor;
  onBook: () => void;
  index: number;
};

export function VendorMatchCard({ vendor, onBook, index }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable style={styles.card} onPress={onBook}>
        <View style={styles.row}>
          <ProfileAvatar uri={vendor.profileImage} size={56} />
          <View style={styles.meta}>
            <Text style={styles.name}>{vendor.name}</Text>
            <Text style={styles.service}>{vendor.serviceType}</Text>
            <View style={styles.inline}>
              <Icon name="call-outline" size={14} color={colors.accent} />
              <Text style={styles.mobile}>{vendor.mobile}</Text>
            </View>
          </View>
          <View style={styles.distancePill}>
            <Icon name="navigate-outline" size={14} color={colors.primary} />
            <Text style={styles.distance}>
              {formatDistance(vendor.distanceMeters)}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.address} numberOfLines={2}>
            {vendor.address}
          </Text>
          <View style={styles.bookBtn}>
            <Text style={styles.bookLabel}>Book</Text>
            <Icon name="chevron-forward" size={16} color="#04130E" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.subtitle,
  },
  service: {
    ...typography.caption,
    color: colors.accent,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mobile: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  distancePill: {
    alignItems: 'flex-end',
    gap: 4,
  },
  distance: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  address: {
    ...typography.caption,
    flex: 1,
    color: colors.textMuted,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    gap: 4,
  },
  bookLabel: {
    color: '#04130E',
    fontWeight: '800',
    fontSize: 13,
  },
});
