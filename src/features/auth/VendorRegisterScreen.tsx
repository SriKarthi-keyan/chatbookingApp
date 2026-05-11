import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AppButton } from '../../shared/components/AppButton';
import { AppTextField } from '../../shared/components/AppTextField';
import { LoadingOverlay } from '../../shared/components/LoadingOverlay';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';
import { FormKeyboardScroll } from '../../shared/components/FormKeyboardScroll';
import { Screen } from '../../shared/components/Screen';
import { getCurrentPositionWithPermission } from '../../core/services/locationService';
import { useVendorsStore } from '../../core/store/vendorsStore';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';
import { createId } from '../../shared/utils/id';
import { RootNavigation } from '../../core/navigation/types';

type FormValues = {
  name: string;
  mobile: string;
  password: string;
  address: string;
  serviceType: string;
};

export function VendorRegisterScreen() {
  const navigation = useNavigation<RootNavigation>();
  const addVendor = useVendorsStore(s => s.addVendor);
  const findByMobile = useVendorsStore(s => s.findByMobile);
  const [profileUri, setProfileUri] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      mobile: '',
      password: '',
      address: '',
      serviceType: '',
    },
  });

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    const asset = result.assets?.[0];
    if (asset?.uri) {
      setProfileUri(asset.uri);
    }
  };

  const onSubmit = handleSubmit(async values => {
    setBusy(true);
    try {
      const mobile = values.mobile.trim();
      if (findByMobile(mobile)) {
        Alert.alert('Mobile already registered', 'Use a different mobile number.');
        return;
      }
      if (values.password.trim().length < 6) {
        Alert.alert('Weak password', 'Use at least 6 characters.');
        return;
      }
      if (!profileUri) {
        Alert.alert('Profile image', 'Please add a profile photo.');
        return;
      }
      let latitude = 0;
      let longitude = 0;
      try {
        const coords = await getCurrentPositionWithPermission();
        latitude = coords.latitude;
        longitude = coords.longitude;
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to read GPS.';
        Alert.alert('Location required', message);
        return;
      }

      addVendor({
        id: createId('vendor'),
        name: values.name.trim(),
        mobile,
        password: values.password,
        address: values.address.trim(),
        profileImage: profileUri,
        latitude,
        longitude,
        serviceType: values.serviceType.trim(),
      });

      Alert.alert('Vendor created', 'You can sign in now.', [
        {
          text: 'OK',
          onPress: () =>
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'RoleSelection' }, { name: 'VendorLogin' }],
              }),
            ),
        },
      ]);
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen>
      <LoadingOverlay visible={busy} />
      <FormKeyboardScroll contentContainerStyle={styles.scroll}>
        <Text style={[typography.subtitle, styles.heading]}>Vendor profile</Text>
        <Text style={[typography.body, styles.lead]}>
          We capture your GPS automatically when you submit.
        </Text>

        <Pressable style={styles.imagePicker} onPress={pickImage}>
          <ProfileAvatar uri={profileUri} size={120} />
          <Text style={styles.previewLabel}>
            {profileUri ? 'Tap to change photo' : 'Tap to add your photo'}
          </Text>
        </Pressable>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <AppTextField
              label="Vendor name"
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
          rules={{ required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } }}
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

        <Controller
          control={control}
          name="address"
          rules={{ required: 'Required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <AppTextField
              label="Address"
              multiline
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="serviceType"
          rules={{ required: 'Required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <AppTextField
              label="Service type"
              placeholder="e.g. Electrician, AC repair"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <AppButton
          label="Save vendor (capture GPS)"
          onPress={onSubmit}
          disabled={!formState.isValid || !profileUri}
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
    marginBottom: spacing.lg,
  },
  imagePicker: {
    marginBottom: spacing.lg,
    alignSelf: 'center',
    alignItems: 'center',
  },
  previewLabel: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 13,
  },
});
