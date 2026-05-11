import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type UserStackParamList = {
  UserTabs: undefined;
  BookingCreate: { vendorId: string; service: string };
};

export type UserTabParamList = {
  UserChat: undefined;
  Nearby: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type VendorTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  RoleSelection: undefined;
  UserRegister: undefined;
  UserLogin: undefined;
  VendorRegister: undefined;
  VendorLogin: undefined;
  UserApp: undefined;
  VendorApp: undefined;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type UserNavigation = NativeStackNavigationProp<UserStackParamList>;

export type UserTabWithStackNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList>,
  NativeStackNavigationProp<UserStackParamList>
>;
