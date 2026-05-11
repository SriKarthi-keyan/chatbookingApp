import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { Screen } from '../../components/Screen';
import { UserStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useBookingsStore } from '../../store/bookingsStore';
import { useVendorsStore } from '../../store/vendorsStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { createId } from '../../utils/id';

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BookingCreateScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<UserStackParamList, 'BookingCreate'>>();
  const userId = useAuthStore(s => s.session?.userId);
  const addBooking = useBookingsStore(s => s.addBooking);
  const findVendor = useVendorsStore(s => s.findById);

  const vendor = findVendor(route.params.vendorId);
  const [date, setDate] = useState(() => new Date());
  const [iosPicker, setIosPicker] = useState<'date' | 'time' | null>(null);

  const bookingDate = useMemo(() => formatDate(date), [date]);
  const bookingTime = useMemo(() => formatTime(date), [date]);

  const openAndroidDate = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      onChange: (_e, selected) => {
        if (selected) {
          setDate(selected);
        }
      },
    });
  };

  const openAndroidTime = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'time',
      is24Hour: true,
      onChange: (_e, selected) => {
        if (selected) {
          setDate(selected);
        }
      },
    });
  };

  const confirm = () => {
    if (!userId || !vendor) {
      Alert.alert('Missing data', 'Please sign in again.');
      return;
    }
    addBooking({
      bookingId: createId('bk'),
      userId,
      vendorId: vendor.id,
      service: route.params.service,
      bookingDate,
      bookingTime,
      status: 'pending',
    });
    Alert.alert('Booking saved', 'Your vendor will see it in their dashboard.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <View style={styles.body}>
        <Text style={typography.subtitle}>{vendor?.name ?? 'Vendor'}</Text>
        <Text style={[typography.body, styles.meta]}>{route.params.service}</Text>

        <Text style={styles.label}>Date & time</Text>
        <Text style={styles.value}>
          {bookingDate} · {bookingTime}
        </Text>

        {Platform.OS === 'ios' ? (
          <View style={styles.row}>
            <AppButton
              label="Pick date"
              variant="secondary"
              onPress={() => setIosPicker('date')}
              style={{ flex: 1 }}
            />
            <AppButton
              label="Pick time"
              variant="secondary"
              onPress={() => setIosPicker('time')}
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <View style={styles.row}>
            <AppButton
              label="Pick date"
              variant="secondary"
              onPress={openAndroidDate}
              style={{ flex: 1 }}
            />
            <AppButton
              label="Pick time"
              variant="secondary"
              onPress={openAndroidTime}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {Platform.OS === 'ios' && iosPicker ? (
          <DateTimePicker
            value={date}
            mode={iosPicker}
            display="spinner"
            themeVariant="dark"
            onChange={(_e, selected) => {
              setIosPicker(null);
              if (selected) {
                setDate(selected);
              }
            }}
          />
        ) : null}

        <AppButton label="Confirm booking" onPress={confirm} style={{ marginTop: spacing.lg }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  meta: {
    color: colors.textMuted,
  },
  label: {
    marginTop: spacing.lg,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
