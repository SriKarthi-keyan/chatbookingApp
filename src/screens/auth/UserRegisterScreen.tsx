import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppTextField } from '../../components/AppTextField';
import { FormKeyboardScroll } from '../../components/FormKeyboardScroll';
import { Screen } from '../../components/Screen';
import { createId } from '../../utils/id';
import { useUsersStore } from '../../store/usersStore';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { RootNavigation } from '../../navigation/types';

type FormValues = {
  name: string;
  mobile: string;
  password: string;
};

export function UserRegisterScreen() {
  const navigation = useNavigation<RootNavigation>();
  const addUser = useUsersStore(s => s.addUser);
  const findByMobile = useUsersStore(s => s.findByMobile);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', mobile: '', password: '' },
  });

  const onSubmit = handleSubmit(values => {
    setSubmitting(true);
    try {
      const normalizedMobile = values.mobile.trim();
      if (findByMobile(normalizedMobile)) {
        Alert.alert('Mobile already registered', 'Please sign in or use a different number.');
        return;
      }
      if (values.password.trim().length < 6) {
        Alert.alert('Weak password', 'Use at least 6 characters.');
        return;
      }
      addUser({
        id: createId('user'),
        name: values.name.trim(),
        mobile: normalizedMobile,
        password: values.password,
      });
      Alert.alert('Account created', 'You can sign in now.', [
        {
          text: 'OK',
          onPress: () =>
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'RoleSelection' }, { name: 'UserLogin' }],
              }),
            ),
        },
      ]);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen>
      <FormKeyboardScroll contentContainerStyle={styles.scroll}>
          <Text style={[typography.subtitle, styles.heading]}>Create your profile</Text>
          <Text style={[typography.body, styles.lead]}>
            Your details are stored only on this device.
          </Text>

          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppTextField
                label="Full name"
                autoCapitalize="words"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="mobile"
            rules={{ required: 'Mobile is required' }}
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
            rules={{ required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
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

          <AppButton
            label="Register"
            onPress={onSubmit}
            loading={submitting}
            disabled={!formState.isValid}
          />
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
});
