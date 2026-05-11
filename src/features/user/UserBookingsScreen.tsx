import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { EmptyState } from '../../shared/components/EmptyState';
import { Booking, BookingStatus } from '../../core/models';
import { useAuthStore } from '../../core/store/authStore';
import { useBookingsStore } from '../../core/store/bookingsStore';
import { useVendorsStore } from '../../core/store/vendorsStore';
import { colors } from '../../shared/theme/colors';
import { radii, spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';

type FilterKey = 'all' | 'pending' | 'accepted' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
];

export function UserBookingsScreen() {
  const userId = useAuthStore(s => s.session?.userId);
  const byUser = useBookingsStore(s => s.byUser);
  const findVendor = useVendorsStore(s => s.findById);
  const [filter, setFilter] = useState<FilterKey>('all');

  const rows = useMemo(() => {
    if (!userId) {
      return [];
    }
    const list = byUser(userId);
    if (filter === 'all') {
      return list;
    }
    return list.filter(b => b.status === filter);
  }, [byUser, filter, userId]);

  if (!userId) {
    return null;
  }

  return (
    <View style={styles.root}>
      <View style={styles.filters}>
        {FILTERS.map(chip => {
          const active = chip.key === filter;
          return (
            <Pressable
              key={chip.key}
              onPress={() => setFilter(chip.key)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={rows}
        keyExtractor={item => item.bookingId}
        contentContainerStyle={
          rows.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <EmptyState
            title="No bookings"
            description="Use the Assistant or Nearby tab to book a vendor."
            icon="calendar-outline"
          />
        }
        renderItem={({ item }) => (
          <BookingRow booking={item} vendorName={findVendor(item.vendorId)?.name} />
        )}
      />
    </View>
  );
}

function BookingRow({
  booking,
  vendorName,
}: {
  booking: Booking;
  vendorName?: string;
}) {
  const statusColor = statusTone(booking.status);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.vendor}>{vendorName ?? 'Vendor'}</Text>
        <View style={[styles.statusPill, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.service}>{booking.service}</Text>
      <View style={styles.metaRow}>
        <Icon name="calendar-outline" size={16} color={colors.textMuted} />
        <Text style={styles.meta}>
          {booking.bookingDate} · {booking.bookingTime}
        </Text>
      </View>
    </View>
  );
}

function statusTone(status: BookingStatus) {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'accepted':
      return colors.accent;
    case 'completed':
      return colors.primary;
    default:
      return colors.textMuted;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
  },
  chipLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipLabelActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  vendor: {
    ...typography.subtitle,
    flex: 1,
    marginRight: spacing.md,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  service: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
