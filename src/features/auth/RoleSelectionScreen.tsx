import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen } from '../../shared/components/Screen';
import { colors } from '../../shared/theme/colors';
import { radii, spacing } from '../../shared/theme/spacing';
import { typography } from '../../shared/theme/typography';
import { RootNavigation } from '../../core/navigation/types';
import { Images } from '../../shared/assets/images';


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RoleSelectionScreen() {
  const navigation = useNavigation<RootNavigation>();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={typography.title}>Choose your role</Text>
        <Text style={[typography.body, styles.lead]}>
          Everything stays on this device. Pick how you want to use LocalBook.
        </Text>
      </View>

      <View style={styles.cards}>
        <AnimatedPressable
          entering={FadeInUp.delay(80).springify()}
          style={styles.card}
          onPress={() => navigation.navigate('UserLogin')}>
          <View style={styles.iconWrap}>
            <Image source={Images.loginProfile} style={{ width: 20, height: 20 }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>User</Text>
            <Text style={styles.cardBody}>
              Chat with the assistant, discover vendors, and book services nearby.
            </Text>
          </View>
          <Image source={Images.onBoardButton} style={{ width: 40, height: 40 }} />
        </AnimatedPressable>

        <AnimatedPressable
          entering={FadeInUp.delay(160).springify()}
          style={styles.card}
          onPress={() => navigation.navigate('VendorLogin')}>
          <View style={[styles.iconWrap, styles.iconAlt]}>
            <Image source={Images.loginProfile} style={{ width: 20, height: 20 }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Vendor</Text>
            <Text style={styles.cardBody}>
              Register your services, capture GPS once, and manage bookings locally.
            </Text>
          </View>
          <Image source={Images.onBoardButton} style={{ width: 40, height: 40 }} />
        </AnimatedPressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New here?</Text>
        <Pressable onPress={() => navigation.navigate('UserRegister')}>
          <Text style={styles.link}>Create user account</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('VendorRegister')}>
          <Text style={[styles.link, { marginTop: spacing.sm }]}>
            Create vendor account
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  lead: {
    marginTop: spacing.xs,
  },
  cards: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAlt: {
    backgroundColor: 'rgba(83, 189, 235, 0.12)',
  },
  cardTitle: {
    ...typography.subtitle,
    marginBottom: 4,
  },
  cardBody: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    marginTop: 'auto',
    padding: spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
