import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { useAuthStore } from '../../core/store/authStore';
import { useVendorsStore } from '../../core/store/vendorsStore';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';
import { RootNavigation } from '../../core/navigation/types';

type FormValues = {
  name: string;
  mobile: string;
  address: string;
  serviceType: string;
};

export function VendorProfileScreen() {
  const navigation = useNavigation<RootNavigation>();
  const vendorId = useAuthStore(s => s.session?.vendorId);
  const findVendor = useVendorsStore(s => s.findById);
  const updateVendor = useVendorsStore(s => s.updateVendor);
  const logout = useAuthStore(s => s.logout);
  const [profileUri, setProfileUri] = useState('');
  const [busy, setBusy] = useState(false);

  const vendor = vendorId ? findVendor(vendorId) : undefined;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      mobile: '',
      address: '',
      serviceType: '',
    },
  });

  useEffect(() => {
    if (vendor) {
      reset({
        name: vendor.name,
        mobile: vendor.mobile,
        address: vendor.address,
        serviceType: vendor.serviceType,
      });
      setProfileUri(vendor.profileImage);
    }
  }, [reset, vendor]);

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

  const onSave = handleSubmit(async values => {
    if (!vendor) {
      return;
    }
    const mobile = values.mobile.trim();
    const conflict = useVendorsStore.getState().findByMobile(mobile);
    if (conflict && conflict.id !== vendor.id) {
      Alert.alert('Mobile in use', 'Choose a different mobile number.');
      return;
    }
    setBusy(true);
    try {
      let { latitude, longitude } = vendor;
      try {
        const coords = await getCurrentPositionWithPermission();
        latitude = coords.latitude;
        longitude = coords.longitude;
      } catch {
        // keep previous coordinates if GPS denied
      }
      updateVendor({
        ...vendor,
        name: values.name.trim(),
        mobile,
        password: vendor.password,
        address: values.address.trim(),
        serviceType: values.serviceType.trim(),
        profileImage: profileUri || vendor.profileImage,
        latitude,
        longitude,
      });
      Alert.alert('Saved', 'Profile updated locally.');
    } finally {
      setBusy(false);
    }
  });

  const onLogout = () => {
    Alert.alert('Sign out', 'Return to the role picker?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            }),
          );
        },
      },
    ]);
  };

  if (!vendor) {
    return null;
  }

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <LoadingOverlay visible={busy} />
      <FormKeyboardScroll contentContainerStyle={styles.scroll}>
          <Text style={[typography.subtitle, styles.heading]}>Vendor profile</Text>
          <Text style={[typography.body, styles.lead]}>
            Updating location refreshes GPS automatically when permission is granted.
          </Text>

          <Pressable style={styles.imagePicker} onPress={pickImage}>
            <ProfileAvatar uri={profileUri} size={120} />
            <Text style={styles.previewHint}>Tap to change photo</Text>
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
                label="Mobile"
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
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <AppButton label="Save changes" onPress={onSave} />
          <View style={{ marginTop: spacing.md }}>
            <AppButton label="Sign out" variant="secondary" onPress={onLogout} />
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
    marginBottom: spacing.lg,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  previewHint: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
  },
});
