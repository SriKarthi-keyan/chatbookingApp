import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { EmptyState } from '../../shared/components/EmptyState';
import { Booking, BookingStatus } from '../../core/models';
import { useAuthStore } from '../../core/store/authStore';
import { useBookingsStore } from '../../core/store/bookingsStore';
import { useUsersStore } from '../../core/store/usersStore';
import { colors } from '../../shared/theme/colors';
import { radii, spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';

type FilterKey = 'pending' | 'accepted' | 'completed' | 'all';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

export function VendorDashboardScreen() {
  const vendorId = useAuthStore(s => s.session?.vendorId);
  const byVendor = useBookingsStore(s => s.byVendor);
  const updateStatus = useBookingsStore(s => s.updateStatus);
  const findUser = useUsersStore(s => s.findById);
  const [filter, setFilter] = useState<FilterKey>('pending');

  const rows = useMemo(() => {
    if (!vendorId) {
      return [];
    }
    const list = byVendor(vendorId);
    if (filter === 'all') {
      return list;
    }
    return list.filter(b => b.status === filter);
  }, [byVendor, filter, vendorId]);

  if (!vendorId) {
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
            title="No bookings in this bucket"
            description="Ask a user on this device to book you from the Assistant tab."
            icon="briefcase-outline"
          />
        }
        renderItem={({ item }) => (
          <VendorBookingCard
            booking={item}
            customer={findUser(item.userId)}
            onAccept={() => updateStatus(item.bookingId, 'accepted')}
            onComplete={() => updateStatus(item.bookingId, 'completed')}
          />
        )}
      />
    </View>
  );
}

function VendorBookingCard({
  booking,
  customer,
  onAccept,
  onComplete,
}: {
  booking: Booking;
  customer?: { name: string; mobile: string };
  onAccept: () => void;
  onComplete: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.customer}>{customer?.name ?? 'Customer'}</Text>
          <View style={styles.inline}>
            <Icon name="call-outline" size={14} color={colors.accent} />
            <Text style={styles.mobile}>{customer?.mobile ?? '—'}</Text>
          </View>
        </View>
        <StatusPill status={booking.status} />
      </View>
      <Text style={styles.service}>{booking.service}</Text>
      <Text style={styles.when}>
        {booking.bookingDate} · {booking.bookingTime}
      </Text>
      <View style={styles.actions}>
        {booking.status === 'pending' ? (
          <Pressable style={styles.secondaryBtn} onPress={onAccept}>
            <Text style={styles.secondaryLabel}>Mark accepted</Text>
          </Pressable>
        ) : null}
        {booking.status !== 'completed' ? (
          <Pressable style={styles.primaryBtn} onPress={onComplete}>
            <Text style={styles.primaryLabel}>Mark completed</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const color =
    status === 'pending'
      ? colors.warning
      : status === 'accepted'
        ? colors.accent
        : colors.primary;
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillText, { color }]}>{status.toUpperCase()}</Text>
    </View>
  );
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
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  customer: {
    ...typography.subtitle,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  mobile: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  service: {
    ...typography.body,
    color: colors.textPrimary,
  },
  when: {
    ...typography.caption,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  primaryBtn: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#04130E',
    fontWeight: '800',
  },
  pill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
