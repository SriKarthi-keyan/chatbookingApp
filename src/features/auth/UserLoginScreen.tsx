import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AppButton } from '../../shared/components/AppButton';
import { AppTextField } from '../../shared/components/AppTextField';
import { FormKeyboardScroll } from '../../shared/components/FormKeyboardScroll';
import { Screen } from '../../shared/components/Screen';
import { useAuthStore } from '../../core/store/authStore';
import { useUsersStore } from '../../core/store/usersStore';
import { getCurrentPositionWithPermission } from '../../core/services/locationService';
import { locationRepository } from '../../core/storage/locationRepository';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';
import { RootNavigation } from '../../core/navigation/types';

type FormValues = {
  mobile: string;
  password: string;
};

export function UserLoginScreen() {
  const navigation = useNavigation<RootNavigation>();
  const setSession = useAuthStore(s => s.setSession);
  const findByMobile = useUsersStore(s => s.findByMobile);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { mobile: '', password: '' },
  });

  const onSubmit = handleSubmit(async values => {
    setLoading(true);
    try {
      const user = findByMobile(values.mobile.trim());
      if (!user || user.password !== values.password) {
        Alert.alert('Sign in failed', 'Mobile or password is incorrect.');
        return;
      }
      setSession({ role: 'user', userId: user.id });
      try {
        const coords = await getCurrentPositionWithPermission();
        locationRepository.setForUser(user.id, coords);
      } catch {
        // Location is optional at login; Assistant will prompt later.
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UserApp' }],
        }),
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <Screen>
      <FormKeyboardScroll contentContainerStyle={styles.scroll}>
          <Text style={[typography.subtitle, styles.heading]}>Welcome back</Text>
          <Text style={[typography.body, styles.lead]}>
            Sign in with the mobile number you registered on this device.
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
            <Text style={styles.muted}>New user?</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('UserRegister')}>
              Create account
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
