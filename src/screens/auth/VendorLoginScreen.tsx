import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppTextField } from '../../components/AppTextField';
import { FormKeyboardScroll } from '../../components/FormKeyboardScroll';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { useVendorsStore } from '../../store/vendorsStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { RootNavigation } from '../../navigation/types';

type FormValues = {
  mobile: string;
  password: string;
};

export function VendorLoginScreen() {
  const navigation = useNavigation<RootNavigation>();
  const setSession = useAuthStore(s => s.setSession);
  const findByMobile = useVendorsStore(s => s.findByMobile);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { mobile: '', password: '' },
  });

  const onSubmit = handleSubmit(values => {
    setLoading(true);
    try {
      const vendor = findByMobile(values.mobile.trim());
      if (!vendor || vendor.password !== values.password) {
        Alert.alert('Sign in failed', 'Mobile or password is incorrect.');
        return;
      }
      setSession({ role: 'vendor', vendorId: vendor.id });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'VendorApp' }],
        }),
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <Screen>
      <FormKeyboardScroll contentContainerStyle={styles.scroll}>
          <Text style={[typography.subtitle, styles.heading]}>Vendor sign in</Text>
          <Text style={[typography.body, styles.lead]}>
            Access your dashboard and bookings stored locally.
          </Text>

          <Controller
            control={control}
            name="mobile"
            rules={{ required: 'Required' }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppTextField
                label="Mobile number"
                keyboardType="phone-pad"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                maxLength={10}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Required' }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppTextField
                label="Password"
                secureTextEntry
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <AppButton label="Sign in" onPress={onSubmit} loading={loading} />

          <View style={styles.inline}>
            <Text style={styles.muted}>New vendor?</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('VendorRegister')}>
              Register
            </Text>
          </View>
      </FormKeyboardScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    marginBottom: spacing.sm,
  },
  lead: {
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  inline: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.lg,
    justifyContent: 'center',
  },
  muted: {
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});
