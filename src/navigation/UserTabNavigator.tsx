import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AssistantTabIcon,
  BookingsTabIcon,
  NearbyTabIcon,
  ProfileTabIcon,
} from './tabBarIcons';
import { UserBookingsScreen } from '../screens/user/UserBookingsScreen';
import { UserChatHomeScreen } from '../screens/user/UserChatHomeScreen';
import { UserProfileScreen } from '../screens/user/UserProfileScreen';
import { NearbyVendorsScreen } from '../screens/user/NearbyVendorsScreen';
import { UserTabParamList } from './types';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<UserTabParamList>();

export function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}>
      <Tab.Screen
        name="UserChat"
        component={UserChatHomeScreen}
        options={{
          title: 'Assistant',
          tabBarLabel: 'Assistant',
          tabBarIcon: AssistantTabIcon,
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyVendorsScreen}
        options={{
          title: 'Nearby',
          tabBarIcon: NearbyTabIcon,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={UserBookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: BookingsTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
