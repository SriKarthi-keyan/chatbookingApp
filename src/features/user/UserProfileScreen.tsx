import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AppButton } from '../../shared/components/AppButton';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';
import { Screen } from '../../shared/components/Screen';
import { useAuthStore } from '../../core/store/authStore';
import { useUsersStore } from '../../core/store/usersStore';
import { colors } from '../../shared/theme/colors';
import { spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';
import { RootNavigation } from '../../core/navigation/types';

export function UserProfileScreen() {
  const navigation = useNavigation<RootNavigation>();
  const userId = useAuthStore(s => s.session?.userId);
  const findUser = useUsersStore(s => s.findById);
  const logout = useAuthStore(s => s.logout);

  const user = userId ? findUser(userId) : undefined;

  const onLogout = () => {
    Alert.alert('Sign out', 'You will return to the role picker.', [
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

  if (!user) {
    return null;
  }

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <ProfileAvatar size={88} />
        </View>
        <Text style={typography.title}>Hello, {user.name}</Text>
        <Text style={[typography.body, styles.line]}>Mobile: {user.mobile}</Text>
        <Text style={[typography.caption, styles.hint]}>
          Passwords are stored locally for this demo. Do not reuse real passwords.
        </Text>
      </View>
      <View style={styles.actions}>
        <AppButton label="Sign out" onPress={onLogout} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.xl,
    padding: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  line: {
    marginTop: spacing.sm,
  },
  hint: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  actions: {
    paddingHorizontal: spacing.xl,
  },
});
