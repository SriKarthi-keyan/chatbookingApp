import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { HeaderHeightContext } from '@react-navigation/elements';
import { VendorMatchCard } from '../../components/VendorMatchCard';
import { EmptyState } from '../../components/EmptyState';
import { AppButton } from '../../components/AppButton';
import { findAllNearbyVendors } from '../../chatbot/matchService';
import { useUserLocationSync } from '../../hooks/useUserLocationSync';
import { UserTabWithStackNavigation } from '../../navigation/types';
import { locationRepository } from '../../storage/locationRepository';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { useVendorsStore } from '../../store/vendorsStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
export function NearbyVendorsScreen() {
  const navigation = useNavigation<UserTabWithStackNavigation>();
  const userId = useAuthStore(s => s.session?.userId);
  const vendors = useVendorsStore(s => s.vendors);
  const [query, setQuery] = useState('');
  const { refresh, loading } = useUserLocationSync(userId);
  const headerHeight = React.useContext(HeaderHeightContext);
  const keyboardVerticalOffset =
    Platform.OS === 'ios' && typeof headerHeight === 'number' ? headerHeight : 0;

  const location = userId ? locationRepository.getForUser(userId) : null;

  const matches = useMemo(
    () => findAllNearbyVendors(vendors, location, query),
    [location, query, vendors],
  );

  if (!userId) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.avoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={styles.root}>
        <View style={styles.toolbar}>
        {!location ? (
          <Text style={styles.banner}>
            Location not saved yet. Tap refresh to enable GPS-based sorting.
          </Text>
        ) : null}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, service, address"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
        />
        <AppButton
          label={loading ? 'Locating…' : 'Refresh location'}
          onPress={() => refresh()}
          variant="secondary"
          loading={loading}
          style={{ marginTop: spacing.sm, width: '100%' }}
        />
        </View>

        <FlatList
        data={matches}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={loading}
            onRefresh={() => refresh()}
          />
        }
        contentContainerStyle={
          matches.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <EmptyState
            title="No vendors yet"
            description="Ask a professional to register as a vendor on this device, or widen your search."
            icon="location-outline"
          />
        }
        renderItem={({ item, index }) => (
          <VendorMatchCard
            vendor={item}
            index={index}
            onBook={() =>
              navigation.navigate('BookingCreate', {
                vendorId: item.id,
                service: item.serviceType,
              })
            }
          />
        )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoid: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolbar: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  banner: {
    color: colors.warning,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
